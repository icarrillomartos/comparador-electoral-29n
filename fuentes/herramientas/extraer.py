import sys, fitz, os
src, dst = sys.argv[1], sys.argv[2]
for f in sorted(os.listdir(src)):
    if not f.endswith('.pdf'): continue
    d = fitz.open(os.path.join(src, f)); out=[]; n=0
    for i, p in enumerate(d, 1):
        t = p.get_text(); n += len(t.strip())
        out.append(f"\n\n===== PÁGINA {i} =====\n{t}")
    open(os.path.join(dst, f[:-4] + '.txt'), 'w').write(''.join(out))
    print(f, len(d), 'págs', n, 'caracteres')
