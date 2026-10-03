"""Chinese front end for ZipVoice: text -> pinyin we decide, not the model.
Same recipe ZipVoice was trained with (jieba + pypinyin, TONE3, tone sandhi),
plus a hand-checked table for polyphones (多音字). The result is written as a
custom lexicon that sherpa-onnx's phrase matcher picks up before its own."""
import re, json, os, jieba, logging
from pypinyin import lazy_pinyin, pinyin, Style
from pypinyin.contrib.tone_convert import to_initials, to_finals_tone3
jieba.setLogLevel(logging.ERROR)
HERE = os.path.dirname(os.path.abspath(__file__))

# phrase -> pinyin, checked by hand. Longest phrases win.
POLY = {
    '天和地': 'tian1 he2 di4', '成了地': 'cheng2 le5 di4', '为地': 'wei2 di4', '大地': 'da4 di4', '地上': 'di4 shang4', '土地': 'tu3 di4',
    '与我为一': 'yu3 wo3 wei2 yi1', '为天': 'wei2 tian1',
    '还没': 'hai2 mei2', '还在': 'hai2 zai4', '还想': 'hai2 xiang3', '还有': 'hai2 you3', '还是': 'hai2 shi4', '还要': 'hai2 yao4',
    '长出': 'zhang3 chu1', '长大': 'zhang3 da4', '长高': 'zhang3 gao1', '长成': 'zhang3 cheng2', '长得': 'zhang3 de5', '会长': 'hui4 zhang3', '长长': 'chang2 chang2', '长颈鹿': 'chang2 jing3 lu4',
    '好玩': 'hao3 wan2', '好吃': 'hao3 chi1', '爱好': 'ai4 hao4', '好奇': 'hao4 qi2', '喜好': 'xi3 hao4',
    '乐乐': 'le4 le4', '快乐': 'kuai4 le4', '音乐': 'yin1 yue4', '乐器': 'yue4 qi4',
    '睡觉': 'shui4 jiao4', '觉得': 'jue2 de5', '感觉': 'gan3 jue2',
    '一种': 'yi4 zhong3', '种树': 'zhong4 shu4', '种下': 'zhong4 xia4', '种子': 'zhong3 zi5', '种出': 'zhong4 chu1', '种什么': 'zhong4 shen2 me5', '五种': 'wu3 zhong3', '种花': 'zhong4 hua1', '再种': 'zai4 zhong4', '种一': 'zhong4 yi4', '种了': 'zhong4 le5', '不同种': 'bu4 tong2 zhong3',
    '重而浊': 'zhong4 er2 zhuo2', '重新': 'chong2 xin1', '重来': 'chong2 lai2',
    '落到': 'luo4 dao4', '掉落': 'diao4 luo4', '落下': 'luo4 xia4',
    '只有': 'zhi3 you3', '一只': 'yi4 zhi1', '五只': 'wu3 zhi1', '两只': 'liang3 zhi1', '三只': 'san1 zhi1', '只小': 'zhi1 xiao3', '只鸟': 'zhi1 niao3',
    '朝着': 'chao2 zhe5', '看着': 'kan4 zhe5', '睡着': 'shui4 zhao2', '着急': 'zhao2 ji2',
    '得高': 'de5 gao1', '跳得': 'tiao4 de5', '得到': 'de2 dao4',
    '数学': 'shu4 xue2', '数一数': 'shu3 yi5 shu3', '数数': 'shu3 shu4',
    '发现': 'fa1 xian4', '头发': 'tou2 fa4', '发光': 'fa1 guang1', '发生': 'fa1 sheng1', '乃发生': 'nai3 fa1 sheng1',
    '一会儿': 'yi2 hui4 er5', '一点': 'yi4 dian3',
    '弹回': 'tan2 hui2', '弹回来': 'tan2 hui2 lai2', '弹起': 'tan2 qi3',
    '转圈': 'zhuan4 quan1', '转晕': 'zhuan4 yun1', '在转': 'zai4 zhuan4', '转圈圈': 'zhuan4 quan1 quan1',
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
    '空中': 'kong1 zhong1', '天空': 'tian1 kong1', '空荡荡': 'kong1 dang4 dang4',
    '尾巴': 'wei3 ba5', '那里': 'na4 li5', '哪里': 'na3 li5', '哪儿': 'na3 er5',
    '转个圈': 'zhuan4 ge4 quan1', '转呀转': 'zhuan4 ya5 zhuan4', '说得': 'shuo1 de5', '先种': 'xian1 zhong4', '种几': 'zhong4 ji3', '花种在': 'hua1 zhong4 zai4',
    '结甜': 'jie1 tian2', '结果子': 'jie1 guo3 zi5', '划一下': 'hua2 yi2 xia4', '剥开': 'bao1 kai1',
    '吗': 'ma5', '呢': 'ne5', '啊': 'a5', '呀': 'ya5', '吧': 'ba5', '啦': 'la5', '哦': 'o4', '嗯': 'en4',
    '嘿嘿': 'hei1 hei1', '嘻嘻': 'xi1 xi1', '哈哈': 'ha1 ha1', '咦': 'yi2', '哇': 'wa1', '呜哇': 'wu1 wa1', '啊呜': 'a1 wu1', '啾啾': 'jiu1 jiu1', '嘟嘟': 'du1 du1',
    '啦啦啦': 'la1 la1 la1', '呼呼': 'hu1 hu1', '呼': 'hu1', '嘿哈': 'hei1 ha1', '啊呀呀': 'a1 ya1 ya1', '哎呀': 'ai1 ya1',
    '盘古生其中': 'pan2 gu3 sheng1 qi2 zhong1', '抟': 'tuan2', '作人': 'zuo4 ren2',
    '宫商角徵羽': 'gong1 shang1 jue2 zhi3 yu3', '上角': 'shang4 jiao3', '下角': 'xia4 jiao3',
    '快快地': 'kuai4 kuai4 de5', '轻轻地': 'qing1 qing1 de5', '慢慢地': 'man4 man4 de5', '悄悄地': 'qiao1 qiao1 de5', '大声地': 'da4 sheng1 de5', '高高地': 'gao1 gao1 de5', '静静地': 'jing4 jing4 de5',
    '睡得': 'shui4 de5', '运转': 'yun4 zhuan3', '因为': 'yin1 wei4', '为什么': 'wei4 shen2 me5', '成为': 'cheng2 wei2', '变为': 'bian4 wei2',
    '了不起': 'liao3 bu4 qi3', '高兴': 'gao1 xing4', '兴奋': 'xing1 fen4', '一会': 'yi2 hui4',
    '很久很久': 'hen2 jiu3 hen2 jiu3', '一生二': 'yi1 sheng1 er4', '三生万物': 'san1 sheng1 wan4 wu4', '第一': 'di4 yi1', '一二三': 'yi1 er4 san1', '看一看': 'kan4 yi5 kan4', '点一点': 'dian3 yi5 dian3', '找一找': 'zhao3 yi5 zhao3', '画一画': 'hua4 yi5 hua4', '说一说': 'shuo1 yi5 shuo1', '听一听': 'ting1 yi5 ting1', '认一认': 'ren4 yi5 ren4', '试一试': 'shi4 yi5 shi4', '想一想': 'xiang3 yi5 xiang3', '摸一摸': 'mo1 yi5 mo1',
    '一颗': 'yi4 ke1', '一起': 'yi4 qi3', '一切': 'yi2 qie4', '一样': 'yi2 yang4', '一下': 'yi2 xia4', '一个': 'yi2 ge4', '一首': 'yi4 shou3',
}
_MAXP = max(len(k) for k in POLY)
PUNCT_MAP = [('「', ''), ('」', ''), ('“', ''), ('”', ''), ('《', ''), ('》', ''), ('……', '，'), ('…', '，'), ('～', '！'), ('~', '！'), ('——', '，'), ('—', '，'), ('·', '，'), (' ', '，'), ('（', '，'), ('）', '，')]

def normalize(text):
    t = text
    for a, b in PUNCT_MAP: t = t.replace(a, b)
    t = re.sub(r'，+', '，', t); t = re.sub(r'，([。！？])', r'\1', t); t = t.strip('，')
    if t and t[-1] not in '。！？!?.': t += '。'
    return t

# a clause that is a single character (e.g. the five notes 宫、商、角、徵、羽)
CLAUSE_POLY = {'角': 'jue2', '徵': 'zhi3', '宫': 'gong1', '商': 'shang1', '羽': 'yu3'}

def is_cjk(c): return '一' <= c <= '鿿'

def to_pinyin(clause):
    """pinyin for a run of Chinese characters, one syllable per char"""
    if clause in CLAUSE_POLY: return [CLAUSE_POLY[clause]], [True]
    py = []
    for seg in jieba.cut(clause):
        py += lazy_pinyin(seg, style=Style.TONE3, tone_sandhi=True, neutral_tone_with_five=True)
    assert len(py) == len(clause), (clause, py)
    # 不 / 一 change tone across word boundaries too (jieba often splits them off)
    NUM = set('零一二三四五六七八九十百千万第')
    for i, ch in enumerate(clause[:-1]):
        nxt = py[i + 1]
        if ch == '不' and py[i] == 'bu4' and nxt.endswith('4'): py[i] = 'bu2'
        if ch == '一' and py[i] == 'yi1' and not (i and clause[i - 1] in NUM) and clause[i + 1] not in NUM:
            py[i] = 'yi2' if nxt.endswith('4') else ('yi4' if nxt[-1] in '123' else 'yi1')
    fixed = [False] * len(clause)
    i = 0
    while i < len(clause):   # longest table match first
        for L in range(min(_MAXP, len(clause) - i), 0, -1):
            w = clause[i:i + L]
            if w in POLY:
                s = POLY[w].split()
                if len(s) == L:
                    py[i:i + L] = s; fixed[i:i + L] = [True] * L
                    i += L; break
        else: i += 1
    return py, fixed

def syl_tokens(s):
    ini = to_initials(s, strict=False); fin = to_finals_tone3(s, strict=False, neutral_tone_with_five=True)
    out = []
    if ini: out.append(ini + '0')
    if fin: out.append(fin)
    return out

def clauses(t):
    """runs of Chinese characters, split at anything else"""
    return [m.group() for m in re.finditer(r'[一-鿿]+', t)]

class Lexicon:
    def __init__(self, tokens_file):
        self.tok = set(l.split('\t')[0] for l in open(tokens_file, encoding='utf-8').read().split('\n') if l)
        self.entries = {}; self.conflicts = []; self.audit = []
    def add_text(self, text, src=''):
        t = normalize(text)
        for c in clauses(t):
            py, fixed = to_pinyin(c)
            for i in range(0, len(c), 10):
                piece, ppy = c[i:i + 10], py[i:i + 10]
                toks = [x for s in ppy for x in syl_tokens(s)]
                bad = [x for x in toks if x not in self.tok]
                if bad: raise ValueError(f'unknown tokens {bad} in {piece} {ppy}')
                line = ' '.join(toks)
                if piece in self.entries and self.entries[piece] != line: self.conflicts.append((piece, self.entries[piece], line))
                self.entries.setdefault(piece, line)
            for i, ch in enumerate(c):
                hs = pinyin(ch, style=Style.TONE3, heteronym=True, neutral_tone_with_five=True)[0]
                if len(set(hs) - {h[:-1] + '5' for h in hs}) > 1 or len(set(h.rstrip('12345') for h in hs)) > 1:
                    self.audit.append((ch, py[i], fixed[i], c[max(0, i - 4): i + 5], src))
        return t
    def write(self, path):
        with open(path, 'w', encoding='utf-8') as f:
            for k, v in self.entries.items(): f.write(f'{k} {v}\n')

if __name__ == '__main__':
    lx = Lexicon('/home/claude/ttslab/models/sherpa-onnx-zipvoice-distill-int8-zh-en-emilia/tokens.txt')
    for s in ['很久很久以前，天和地还没有分开，一切都混在一起，像一颗蛋。', '轻而清的升上去，成了天；重而浊的沉下来，成了地。', '「乐乐」很开心。我会唱五个音：宫、商、角、徵、羽。']:
        print(normalize(s), [to_pinyin(c)[0] for c in clauses(normalize(s))])
