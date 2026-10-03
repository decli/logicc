import sherpa_onnx, numpy as np, re, unicodedata
import os
M = os.environ.get('KOKORO_MODELS', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models'))
def kokoro(ver):
    D = f'{M}/kokoro-multi-lang-{ver}'
    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=f'{D}/model.onnx', voices=f'{D}/voices.bin', tokens=f'{D}/tokens.txt',
                lexicon=f'{D}/lexicon-us-en.txt,{D}/lexicon-zh.txt', data_dir=f'{D}/espeak-ng-data', dict_dir=f'{D}/dict'),
            num_threads=2, debug=False, provider='cpu'),
        rule_fsts=f'{D}/date-zh.fst,{D}/phone-zh.fst,{D}/number-zh.fst', max_num_sentences=1)
    return sherpa_onnx.OfflineTts(cfg)
def asr_zh():
    D = f'{M}/sherpa-onnx-paraformer-zh-small-2024-03-09'
    return sherpa_onnx.OfflineRecognizer.from_paraformer(paraformer=f'{D}/model.int8.onnx', tokens=f'{D}/tokens.txt', num_threads=2)
def asr_en():
    D = f'{M}/sherpa-onnx-whisper-tiny.en'
    return sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{D}/tiny.en-encoder.int8.onnx', decoder=f'{D}/tiny.en-decoder.int8.onnx', tokens=f'{D}/tiny.en-tokens.txt', num_threads=2)
def transcribe(rec, samples, sr):
    s = rec.create_stream(); s.accept_waveform(sr, np.asarray(samples, dtype=np.float32)); rec.decode_stream(s); return s.result.text
def norm_zh(t): return ''.join(ch for ch in t if '一' <= ch <= '鿿' or ch.isalnum())
def norm_en(t): return re.sub(r'[^a-z0-9 ]', ' ', t.lower()).split()
def edit(a, b):
    d = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        p, d[0] = d[0], i
        for j in range(1, len(b) + 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] != b[j - 1]))
    return d[len(b)]
def cer(ref, hyp, lang):
    if lang == 'zh': r, h = norm_zh(ref), norm_zh(hyp)
    else: r, h = norm_en(ref), norm_en(hyp)
    return edit(r, h) / max(1, len(r))
def f0(samples, sr):
    x = np.asarray(samples, dtype=np.float64); fl = int(sr * 0.04); hop = int(sr * 0.01); out = []
    lo, hi = int(sr / 500), int(sr / 70)
    for st in range(0, len(x) - fl, hop):
        fr = x[st:st + fl]; fr = fr - fr.mean()
        if np.sqrt((fr ** 2).mean()) < 0.02: continue
        ac = np.correlate(fr, fr, 'full')[fl - 1:]
        if ac[0] <= 0: continue
        seg = ac[lo:hi]; k = np.argmax(seg) + lo
        if ac[k] / ac[0] > 0.45: out.append(sr / k)
    return float(np.median(out)) if out else 0.0
