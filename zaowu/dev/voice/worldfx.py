import numpy as np, pyworld as pw, soundfile as sf
def world_transform(x, sr, f0_mul=1.0, expand=1.0, formant=1.0, tempo=1.0):
    """pitch shift (f0_mul), intonation expansion around the median (expand),
    formant/vocal-tract scaling (formant>1 → smaller head), tempo (>1 faster)"""
    x = np.asarray(x, dtype=np.float64)
    f0, t = pw.harvest(x, sr, f0_floor=70, f0_ceil=700, frame_period=5)
    sp = pw.cheaptrick(x, f0, t, sr); ap = pw.d4c(x, f0, t, sr)
    v = f0 > 0; med = np.median(f0[v]) if v.any() else 200
    st = np.zeros_like(f0); st[v] = 12 * np.log2(f0[v] / med)
    f0n = np.zeros_like(f0); f0n[v] = med * f0_mul * 2 ** (st[v] * expand / 12)
    if formant != 1.0:
        n = sp.shape[1]; src = np.arange(n) / formant
        sp = np.array([np.interp(src, np.arange(n), row) for row in sp])
        ap = np.array([np.interp(src, np.arange(n), row) for row in ap])
    if tempo != 1.0:
        m = len(f0); idx = np.clip(np.arange(0, m, tempo), 0, m - 1)
        lo = np.floor(idx).astype(int); f0n = f0n[lo]; sp = sp[lo]; ap = ap[lo]
    y = pw.synthesize(np.ascontiguousarray(f0n), np.ascontiguousarray(sp), np.ascontiguousarray(ap), sr, 5)
    y = y / (np.abs(y).max() + 1e-9) * 0.9
    return y.astype(np.float32)
