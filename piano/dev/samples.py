"""Piano samples for 彩虹钢琴: Salamander Grand Piano V3 (Alexander Holm, CC BY 3.0),
the 30-note set Tone.js hosts (A0 … C8, one every minor third).

  python3 piano/dev/samples.py      -> piano/piano.bin + piano/piano.json

Each note is cut to the length a child will actually hear (long bass notes ring for 9 s, the top octave
for 3.5 s), faded out, folded to mono (the page pans every note by where it sits on the keyboard and adds
its own stereo hall) and packed back to back like the voice banks: piano.json = {"v":1,"n":[[midi, offset, length], …]}."""
import json, os, subprocess, tempfile, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
CACHE = os.path.join(HERE, 'cache', 'salamander')
URL = 'https://tonejs.github.io/audio/salamander/{}.mp3'
NAMES = {0: 'C', 3: 'Ds', 6: 'Fs', 9: 'A'}

def notes():
    for midi in range(21, 109):
        if midi % 12 in NAMES:
            yield midi, f'{NAMES[midi % 12]}{midi // 12 - 1}'

def length(midi):
    return 9.0 if midi < 36 else 7.0 if midi < 60 else 5.0 if midi < 84 else 3.5

def main():
    os.makedirs(CACHE, exist_ok=True)
    blob, index = bytearray(), []
    with tempfile.TemporaryDirectory() as tmp:
        for midi, name in notes():
            src = os.path.join(CACHE, name + '.mp3')
            if not os.path.exists(src):
                print('download', name)
                urllib.request.urlretrieve(URL.format(name), src)
            t = length(midi)
            out = os.path.join(tmp, name + '.mp3')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-t', str(t), '-ac', '1',
                            '-af', f'afade=t=out:st={t - 1.6}:d=1.6', '-ar', '44100', '-b:a', '64k', out], check=True)
            b = open(out, 'rb').read()
            index.append([midi, len(blob), len(b)])
            blob += b
    open(os.path.join(SITE, 'piano.bin'), 'wb').write(blob)
    json.dump({'v': 1, 'n': index}, open(os.path.join(SITE, 'piano.json'), 'w'), separators=(',', ':'))
    print(f'{len(index)} notes, {len(blob) / 1e6:.2f} MB -> piano/piano.bin|json')

if __name__ == '__main__':
    main()
