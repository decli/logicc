"""Chinese polyphones (多音字) for edge-tts.

The speech service only accepts plain text, so we cannot hand it pinyin. Instead:
  1. decide the reading every polyphone should have (jieba + pypinyin + the hand-checked POLY table);
  2. find out which reading the service actually used: synthesize the line again with the character
     swapped for an unambiguous homophone of each candidate reading (长 → 掌 / 常) and see which take
     the original is closest to, on that one syllable (MFCC + pitch, DTW);
  3. where it read the wrong one, send the homophone instead (the screen still shows the real text).
Character-level speech recognition cannot do step 2: 长大 read as cháng dà still transcribes as 长大."""
import asyncio, json, logging, os, re, hashlib
import numpy as np
import jieba
from pypinyin import lazy_pinyin, pinyin, Style
from pypinyin.contrib.tone_convert import to_tone3
jieba.setLogLevel(logging.ERROR)
HERE = os.path.dirname(os.path.abspath(__file__))

# phrase -> lexical pinyin (before tone sandhi), checked by hand. Longest phrases win.
POLY = {
    '天和地': 'tian1 he2 di4', '成了地': 'cheng2 le5 di4', '为地': 'wei2 di4', '大地': 'da4 di4', '地上': 'di4 shang4', '土地': 'tu3 di4',
    '与我为一': 'yu3 wo3 wei2 yi1', '为天': 'wei2 tian1',
    '还没': 'hai2 mei2', '还在': 'hai2 zai4', '还想': 'hai2 xiang3', '还有': 'hai2 you3', '还是': 'hai2 shi4', '还要': 'hai2 yao4', '还差': 'hai2 cha4', '还没有': 'hai2 mei2 you3',
    '长出': 'zhang3 chu1', '长大': 'zhang3 da4', '长高': 'zhang3 gao1', '长成': 'zhang3 cheng2', '长得': 'zhang3 de5', '会长': 'hui4 zhang3', '长长': 'chang2 chang2', '长颈鹿': 'chang2 jing3 lu4',
    '好玩': 'hao3 wan2', '好吃': 'hao3 chi1', '爱好': 'ai4 hao4', '好奇': 'hao4 qi2', '喜好': 'xi3 hao4', '好高': 'hao3 gao1',
    '乐乐': 'le4 le4', '快乐': 'kuai4 le4', '音乐': 'yin1 yue4', '乐器': 'yue4 qi4', '欢乐颂': 'huan1 le4 song4',
    '睡觉': 'shui4 jiao4', '觉得': 'jue2 de5', '感觉': 'gan3 jue2',
    '一种': 'yi4 zhong3', '种树': 'zhong4 shu4', '种下': 'zhong4 xia4', '种子': 'zhong3 zi5', '种出': 'zhong4 chu1', '种什么': 'zhong4 shen2 me5', '五种': 'wu3 zhong3', '种花': 'zhong4 hua1', '再种': 'zai4 zhong4', '种一': 'zhong4 yi4', '种了': 'zhong4 le5', '不同种': 'bu4 tong2 zhong3', '七种': 'qi1 zhong3',
    '重而浊': 'zhong4 er2 zhuo2', '重新': 'chong2 xin1', '重来': 'chong2 lai2', '重画': 'chong2 hua4',
    '落到': 'luo4 dao4', '掉落': 'diao4 luo4', '落下': 'luo4 xia4',
    '只有': 'zhi3 you3', '一只': 'yi4 zhi1', '五只': 'wu3 zhi1', '两只': 'liang3 zhi1', '三只': 'san1 zhi1', '只小': 'zhi1 xiao3', '只鸟': 'zhi1 niao3', '只能': 'zhi3 neng2',
    '朝着': 'chao2 zhe5', '看着': 'kan4 zhe5', '睡着': 'shui4 zhao2', '着急': 'zhao2 ji2',
    '得高': 'de5 gao1', '跳得': 'tiao4 de5', '得到': 'de2 dao4',
    '数学': 'shu4 xue2', '数一数': 'shu3 yi1 shu3', '数数': 'shu3 shu4', '数双数': 'shu3 shuang1 shu4', '倒着数': 'dao4 zhe5 shu3', '顺数': 'shun4 shu3',
    '发现': 'fa1 xian4', '头发': 'tou2 fa4', '发光': 'fa1 guang1', '发生': 'fa1 sheng1', '乃发生': 'nai3 fa1 sheng1',
    '一会儿': 'yi1 hui4 er5', '一点': 'yi1 dian3',
    '弹回': 'tan2 hui2', '弹回来': 'tan2 hui2 lai2', '弹起': 'tan2 qi3',
    # 彩虹钢琴: every 弹 on this site means playing an instrument or bouncing — tán, never dàn (子弹)
    '弹': 'tan2', '弹完': 'tan2 wan2', '弹得': 'tan2 de5', '弹琴': 'tan2 qin2', '跟着': 'gen1 zhe5', '舞曲': 'wu3 qu3', '卡农': 'ka3 nong2',
    '转一转': 'zhuan4 yi1 zhuan4', '生日快乐': 'sheng1 ri4 kuai4 le4', '圣诞快乐': 'sheng4 dan4 kuai4 le4', '新年好': 'xin1 nian2 hao3',
    '长长的': 'chang2 chang2 de5', '变得': 'bian4 de5', '学得': 'xue2 de5', '好听': 'hao3 ting1', '一遍': 'yi1 bian4',
    '转圈': 'zhuan4 quan1', '转晕': 'zhuan4 yun1', '在转': 'zai4 zhuan4', '转圈圈': 'zhuan4 quan1 quan1', '转半圈': 'zhuan4 ban4 quan1', '转一下': 'zhuan4 yi1 xia4', '转过来': 'zhuan4 guo4 lai2', '转转': 'zhuan4 zhuan4',
    '晕': 'yun1', '好晕': 'hao3 yun1',
    '没有': 'mei2 you3', '没事': 'mei2 shi4',
    '都是': 'dou1 shi4', '都还': 'dou1 hai2',
    '的确': 'di2 que4', '目的': 'mu4 di4',
    '风筝': 'feng1 zheng1', '扇子': 'shan4 zi5', '小扇子': 'xiao3 shan4 zi5',
    '和我': 'he2 wo3', '暖和': 'nuan3 huo5',
    '馒头': 'man2 tou5', '豆包': 'dou4 bao1', '花卷': 'hua1 juan3', '麻薯': 'ma2 shu3', '咕噜': 'gu1 lu1', '栗子': 'li4 zi5',
    '藏起来': 'cang2 qi3 lai2', '躲藏': 'duo3 cang2',
    '盛开': 'sheng4 kai1', '应该': 'ying1 gai1', '答应': 'da1 ying4',
    '曲线': 'qu1 xian4', '弯曲': 'wan1 qu1',
    '似的': 'shi4 de5', '相似': 'xiang1 si4',
    '处理': 'chu3 li3', '到处': 'dao4 chu4',
    '便宜': 'pian2 yi5', '方便': 'fang1 bian4',
    '假如': 'jia3 ru2', '放假': 'fang4 jia4',
    '背着': 'bei1 zhe5', '后背': 'hou4 bei4',
    '空中': 'kong1 zhong1', '天空': 'tian1 kong1', '空荡荡': 'kong1 dang4 dang4', '空格': 'kong4 ge2', '空的': 'kong4 de5', '中间空': 'zhong1 jian1 kong4', '补空': 'bu3 kong4',
    '尾巴': 'wei3 ba5', '那里': 'na4 li5', '哪里': 'na3 li5', '哪儿': 'na3 er5',
    '转个圈': 'zhuan4 ge4 quan1', '转呀转': 'zhuan4 ya5 zhuan4', '说得': 'shuo1 de5', '先种': 'xian1 zhong4', '种几': 'zhong4 ji3', '花种在': 'hua1 zhong4 zai4',
    '结甜': 'jie1 tian2', '结果子': 'jie1 guo3 zi5', '划一下': 'hua2 yi1 xia4', '剥开': 'bao1 kai1',
    '盘古生其中': 'pan2 gu3 sheng1 qi2 zhong1', '抟': 'tuan2', '作人': 'zuo4 ren2',
    '宫商角徵羽': 'gong1 shang1 jue2 zhi3 yu3', '上角': 'shang4 jiao3', '下角': 'xia4 jiao3',
    '运转': 'yun4 zhuan3', '因为': 'yin1 wei4', '为什么': 'wei4 shen2 me5', '成为': 'cheng2 wei2', '变为': 'bian4 wei2',
    '了不起': 'liao3 bu4 qi3', '高兴': 'gao1 xing4', '兴奋': 'xing1 fen4',
    # the logic games on the home page
    '调速': 'tiao2 su4', '调快慢': 'tiao2 kuai4 man4', '调个头': 'diao4 ge4 tou2', '对折': 'dui4 zhe2', '折起来': 'zhe2 qi3 lai2',
    '一行': 'yi1 hang2', '一整行': 'yi1 zheng3 hang2', '行或': 'hang2 huo4', '几行': 'ji3 hang2', '消掉一行': 'xiao1 diao4 yi1 hang2',
    '倒着': 'dao4 zhe5', '倒序': 'dao4 xu4', '往回': 'wang3 hui2', '空着': 'kong4 zhe5',
    '一模一样': 'yi1 mu2 yi1 yang4', '模样': 'mu2 yang4', '规律': 'gui1 lv4', '重复': 'chong2 fu4',
    '分成': 'fen1 cheng2', '分一分': 'fen1 yi1 fen1', '合起来': 'he2 qi3 lai2', '和几': 'he2 ji3',
    '先点': 'xian1 dian3', '暂停': 'zan4 ting2', '堆满': 'dui1 man3', '拼满': 'pin1 man3',
    '数点点': 'shu3 dian3 dian3', '中间的空': 'zhong1 jian1 de5 kong4', '肚子': 'du4 zi5',
    '睡得': 'shui4 de5', '走得': 'zou3 de5', '跑得': 'pao3 de5', '画得': 'hua4 de5',
    '快快地': 'kuai4 kuai4 de5', '轻轻地': 'qing1 qing1 de5', '慢慢地': 'man4 man4 de5', '悄悄地': 'qiao1 qiao1 de5', '大声地': 'da4 sheng1 de5', '高高地': 'gao1 gao1 de5', '静静地': 'jing4 jing4 de5',
    # 古诗太鼓: the poems, as the 统编 textbook marks them
    '曲项': 'qu1 xiang4', '莲叶间': 'lian2 ye4 jian1', '汉乐府': 'han4 yue4 fu3', '乐府': 'yue4 fu3', '远看': 'yuan3 kan4', '有色': 'you3 se4',
    '花还在': 'hua1 hai2 zai4', '日当午': 'ri4 dang1 wu3', '谁知': 'shui2 zhi1', '古朗月行': 'gu3 lang3 yue4 xing2', '不识': 'bu4 shi2', '呼作': 'hu1 zuo4',
    '解落': 'jie3 luo4', '万竿斜': 'wan4 gan1 xie2', '李峤': 'li3 qiao2', '不觉晓': 'bu4 jue2 xiao3', '处处': 'chu4 chu4', '花落': 'hua1 luo4', '知多少': 'zhi1 duo1 shao3',
    '乘舟': 'cheng2 zhou1', '将欲行': 'jiang1 yu4 xing2', '踏歌': 'ta4 ge1', '童子': 'tong2 zi3', '只在': 'zhi3 zai4', '不知处': 'bu4 zhi1 chu4',
    '不解': 'bu4 jie3', '藏踪迹': 'cang2 zong1 ji4', '树阴': 'shu4 yin1', '小荷': 'xiao3 he2', '才露': 'cai2 lu4', '尖尖角': 'jian1 jian1 jiao3', '立上头': 'li4 shang4 tou2',
    # 二到四年级
    '荷尽': 'he2 jin4', '泛尽': 'fan4 jin4', '芳菲尽': 'fang1 fei1 jin4', '挑促织': 'tiao3 cu4 zhi1', '比西子': 'bi3 xi1 zi3', '朝辞': 'zhao1 ci2', '一日还': 'yi1 ri4 huan2', '万重山': 'wan4 chong2 shan1', '采莲曲': 'cai3 lian2 qu3', '为异客': 'wei2 yi4 ke4', '长恨': 'chang2 hen4',
    '似剪刀': 'si4 jian3 dao1', '林子方': 'lin2 zi3 fang1', '门泊': 'men2 bo2', '万颗子': 'wan4 ke1 zi3', '查慎行': 'zha1 shen4 xing2',
    '稚子': 'zhi4 zi3', '不应人': 'bu4 ying4 ren2', '依山尽': 'yi1 shan1 jin4', '敕勒': 'chi4 le4', '天似': 'tian1 si4', '笼盖': 'long3 gai4', '见牛羊': 'xian4 niu2 yang2',
    '红冠': 'hong2 guan1', '走将来': 'zou3 jiang1 lai2', '唐寅': 'tang2 yin2',
    # ... and what the narrator says about them
    '高兴地': 'gao1 xing4 de5', '完整地': 'wan2 zheng3 de5', '大摇大摆地': 'da4 yao2 da4 bai3 de5', '弯着': 'wan1 zhe5', '踏着': 'ta4 zhe5', '挨着': 'ai1 zhe5',
    '斜着': 'xie2 zhe5', '撑着': 'cheng1 zhe5', '望着': 'wang4 zhe5', '划着': 'hua2 zhe5', '打落': 'da3 luo4', '露出': 'lu4 chu1', '干了': 'gan4 le5', '种田': 'zhong4 tian2',
    '鸡冠': 'ji1 guan1', '衣裳': 'yi1 shang5', '叫作': 'jiao4 zuo4', '浇浇水': 'jiao1 jiao1 shui3', '背诗': 'bei4 shi1', '会背': 'hui4 bei4', '背一首': 'bei4 yi4 shou3',
    '背完': 'bei4 wan2', '划回来': 'hua2 hui2 lai2', '划开': 'hua2 kai1', '低下头': 'di1 xia4 tou2', '舍不得': 'she3 bu4 de5', '玩得': 'wan2 de5', '开得': 'kai1 de5', '演出来': 'yan3 chu1 lai2', '更好看': 'geng4 hao3 kan4',
}
# readings that depend on what is around a Chinese run (digits, enumeration commas): (pattern, reading of the matched char)
CONTEXT = [(re.compile(r'(?<=\d )行'), 'hang2'),                    # 消掉 2 行
           (re.compile(r'(?<=、)角(?=、)'), 'jue2'), (re.compile(r'(?<=、)徵(?=、)'), 'zhi3')]   # 宫、商、角、徵、羽
_MAXP = max(len(k) for k in POLY)
SKIP = set('一不') | set('啊呀啦哇吧呢吗哦嗯咦嘿嘻哈呼哎呜啾嘟')   # tone sandhi (the service does it) and interjections

def zh_clean(text):
    """what we send for Chinese: drop marks a voice might read out or pause oddly on"""
    t = text
    for a, b in [('「', ''), ('」', ''), ('“', ''), ('”', ''), ('《', ''), ('》', ''), ('～', '！'), ('~', '！'), ('·', '，'), ('|', '，'), ('×', '乘')]:
        t = t.replace(a, b)
    t = re.sub(r'！([。！？])', r'\1', t)
    t = re.sub(r'(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])', '', t)   # a space between Chinese characters becomes a long pause
    return t

def intended(text):
    """[(index, char, lexical reading)] for every Chinese character, with the POLY table applied"""
    out = []
    for m in re.finditer(r'[一-鿿]+', text):
        clause, base = m.group(), m.start()
        py = []
        for seg in jieba.cut(clause):
            py += lazy_pinyin(seg, style=Style.TONE3, neutral_tone_with_five=True, tone_sandhi=False)
        i = 0
        while i < len(clause):
            for L in range(min(_MAXP, len(clause) - i), 0, -1):
                w = clause[i:i + L]
                if w in POLY:
                    s = POLY[w].split()
                    if len(s) == L: py[i:i + L] = s; i += L; break
            else: i += 1
        out += [(base + k, c, py[k]) for k, c in enumerate(clause)]
    at = {i: n for n, (i, c, r) in enumerate(out)}
    for pat, r in CONTEXT:
        for m in pat.finditer(text):
            if m.start() in at: n = at[m.start()]; out[n] = (out[n][0], out[n][1], r)
    return out

# ---------- which characters really have more than one reading, and stand-ins for each reading ----------
_TABLES = None
# hand-picked stand-ins where the automatic pick has nothing common enough
EXTRA = {'hao3': '郝', 'hao4': '耗', 'shu3': '鼠', 'zhong3': '肿', 'chong2': '虫', 'bei1': '杯', 'diao4': '钓', 'zhuo2': '啄',
         'zhuan4': '赚', 'zang4': '葬', 'le4': '勒', 'chao2': '潮', 'he2': '河', 'shan1': '山', 'shan4': '善', 'tan2': '谈',
         'dan4': '蛋', 'zhe2': '哲', 'she2': '蛇', 'mu2': '膜', 'kong4': '控', 'jiao3': '脚', 'jue2': '决', 'kan4': '瞰', 'hun4': '诨', 'chu4': '触'}

# common characters that are themselves read more than one way: never use them as stand-ins
# (地 is mostly dì in phrase lists, but 红色地 is read de — exactly what we are trying to tell apart)
AVOID = set('地的得着了和都还长行重发乐觉只种数好为便空角调倒看分几中相少当差处应背藏曲似转弹系结给漂薄冲正奇散难降尽量'
            '参省宿血露削剥塞折舍佛朝传大单弄卡吓壳会合扎率要将教兴假更间强切划挑奔担称载待缝扇卷泡模核降宁')

def tables():
    """(practical readings per char, stand-ins per reading). A reading is 'practical' if it covers at least 3% of the
    char's uses in pypinyin's phrase dictionary; a stand-in is a common char whose own default covers 97%+."""
    global _TABLES
    if _TABLES: return _TABLES
    from pypinyin.phrases_dict import phrases_dict
    jieba.initialize()
    freq = {}
    for w, f in jieba.dt.FREQ.items():
        for c in set(w):
            if '一' <= c <= '鿿': freq[c] = freq.get(c, 0) + f
    uses = {}
    for ph, pys in phrases_dict.items():
        if len(ph) != len(pys): continue
        for c, p in zip(ph, pys):
            u = uses.setdefault(c, {}); r = to_tone3(p[0], neutral_tone_with_five=True); u[r] = u.get(r, 0) + 1
    practical, stand = {}, {}
    for c in set(freq) | set(uses):
        d = pinyin(c, style=Style.TONE3, neutral_tone_with_five=True)[0][0]
        u = uses.get(c, {}); tot = sum(u.values())
        rs = {d} | {r for r, n in u.items() if tot and n / tot >= 0.05 and n >= 3}
        practical[c] = rs
        if c not in AVOID and freq.get(c, 0) >= 800 and (not tot or u.get(d, 0) / tot >= 0.97):
            stand.setdefault(d, []).append((freq[c], c))
    stand = {r: [c for _, c in sorted(v, reverse=True)[:6]] for r, v in stand.items()}
    for r, c in EXTRA.items():
        stand[r] = [c] + [x for x in stand.get(r, []) if x != c][:5]
    _TABLES = (practical, stand)
    return _TABLES

def polyphones(text):
    """[(index, char, wanted reading, other practical readings)] worth checking in this line"""
    practical, _ = tables()
    out = []
    for i, c, r in intended(text):
        if c in SKIP: continue
        rs = practical.get(c, set()) | {r}
        if len(rs) > 1: out.append((i, c, r, sorted(rs - {r})))
    return out

# ---------- acoustic comparison ----------
SR = 16000

def _syllable_span(text, bounds, pos):
    """the word boundary covering index pos, split evenly between its characters, padded a quarter syllable"""
    i = 0
    for w, a, b in bounds:
        j = text.find(w, i)
        if j < 0: continue
        if j <= pos < j + len(w):
            k, n = pos - j, len(w); step = (b - a) / n
            return a + step * (k - 0.25), a + step * (k + 1.25)
        i = j + len(w)
    return None

def _feats(x, span, med):
    import librosa
    a, b = span
    seg = x[max(0, int(a * SR)): min(len(x), int(b * SR))]
    if len(seg) < 1200: seg = np.pad(seg, (0, 1200 - len(seg)))
    mf = librosa.feature.mfcc(y=seg, sr=SR, n_mfcc=20, n_fft=512, hop_length=160)[1:]
    f0 = librosa.yin(seg, fmin=80, fmax=500, sr=SR, frame_length=1024, hop_length=160)
    rms = librosa.feature.rms(y=seg, frame_length=1024, hop_length=160)[0]
    n = min(mf.shape[1], len(f0), len(rms))
    voiced = rms[:n] > max(rms.max() * 0.12, 1e-4)
    st = np.where(voiced, 12 * np.log2(f0[:n] / med), 0.0)
    return np.vstack([mf[:, :n] / 12.0, st[None, :] / 3.0])

def _dist(A, B):
    import librosa
    D, wp = librosa.sequence.dtw(X=A, Y=B, metric='euclidean')
    return float(D[-1, -1] / len(wp))

def _median_f0(x):
    import librosa
    f0 = librosa.yin(x, fmin=80, fmax=500, sr=SR, frame_length=1024, hop_length=160)
    rms = librosa.feature.rms(y=x, frame_length=1024, hop_length=160)[0][:len(f0)]
    v = f0[:len(rms)][rms > rms.max() * 0.1]
    return float(np.median(v)) if len(v) else 200.0

class PolyChecker:
    """synth(text) -> (pcm16k float32, word bounds) must be an async callable using the voice under test"""
    def __init__(self, synth, cache_file):
        self.synth, self.cache_file = synth, cache_file
        self.cache = json.load(open(cache_file)) if os.path.exists(cache_file) else {}

    def save(self):
        tmp = self.cache_file + '.tmp'
        json.dump(self.cache, open(tmp, 'w'), ensure_ascii=False, indent=0)
        os.replace(tmp, self.cache_file)

    @staticmethod
    def context(text, pos, want):
        """the reading a voice picks depends on the nearby words: lines that share them share the verdict"""
        return f'{text[max(0, pos - 3):pos]}[{text[pos]}]{text[pos + 1:pos + 4]}|{want}'

    async def _takes(self, texts):
        keys = [t for t in dict.fromkeys(texts) if t not in self._jobs]
        for k, v in zip(keys, await asyncio.gather(*[self.synth(k) for k in keys])): self._jobs[k] = v

    def _judge(self, text, pos, ch, want, others, O, span, med, stand, n):
        """compare the original syllable with up to n stand-ins per reading -> (s, verdict, fix)"""
        F = {}
        for r in [want] + others:
            F[r] = []
            for c in [c for c in stand.get(r, []) if c != ch][:n]:
                alt = text[:pos] + c + text[pos + 1:]
                y, b2 = self._jobs[alt]
                F[r].append((c, _feats(y, _syllable_span(alt, b2, pos) or span, med)))
        others = [r for r in others if F.get(r)]
        dw = [(_dist(O, A), c) for c, A in F[want]]
        do = [(_dist(O, B), r) for r in others for _, B in F[r]]
        best_w, best_o = min(dw, default=(99, None)), min(do, default=(99, None))
        # the same reading often comes back as the very same audio: that settles it
        if best_w[0] <= 0.6 and best_o[0] > 1.5: return 1.0, 'ok', best_w[1]
        if best_o[0] <= 0.6 and best_w[0] > 1.5: return -1.0, ('wrong' if dw else 'wrong-nofix'), (min(dw)[1] if dw else None)
        if not dw: return 0.0, 'unverified', None
        if not others: return 1.0, 'ok', best_w[1]
        scores = {r: float(np.mean([(_dist(O, B) - _dist(O, A)) / max(_dist(A, B), 1e-6) for _, A in F[want] for _, B in F[r]])) for r in others}
        s = min(scores.values())
        return s, ('ok' if s >= 0.25 else 'wrong' if s <= -0.25 else 'unsure'), best_w[1]

    async def check(self, text):
        """-> (text to send, [findings]) ; finding = dict(pos, char, want, s, verdict, fix)"""
        cand = polyphones(text)
        if not cand: return text, []
        _, stand = tables()
        known = self.cache.setdefault('ctx', {})
        found = [dict(known[self.context(text, p, w)], pos=p) for p, c, w, o in cand if self.context(text, p, w) in known]
        cand = [c for c in cand if self.context(text, c[0], c[2]) not in known]
        if cand:
            self._jobs = {}
            alts = lambda n: [text[:pos] + c + text[pos + 1:] for pos, ch, want, others in cand for r in [want] + others for c in [c for c in stand.get(r, []) if c != ch][:n]]
            await self._takes([text] + alts(3))
            x, bounds = self._jobs[text]
            med = _median_f0(x)
            for pos, ch, want, others in cand:
                span = _syllable_span(text, bounds, pos)
                if not span: continue
                O = _feats(x, span, med)
                s, verdict, fix = self._judge(text, pos, ch, want, others, O, span, med, stand, 3)
                if verdict in ('unsure', 'unverified'):   # second look with more stand-ins
                    await self._takes([text[:pos] + c + text[pos + 1:] for r in [want] + others for c in [c for c in stand.get(r, []) if c != ch][:6]])
                    s, verdict, fix = self._judge(text, pos, ch, want, others, O, span, med, stand, 6)
                f = dict(pos=pos, char=ch, want=want, s=round(s, 2), verdict=verdict, fix=fix)
                found.append(f); known[self.context(text, pos, want)] = {k: v for k, v in f.items() if k != 'pos'}
        send = list(text)
        for f in found:
            if f['verdict'] == 'wrong' and f['fix']: send[f['pos']] = f['fix']
        return ''.join(send), found
