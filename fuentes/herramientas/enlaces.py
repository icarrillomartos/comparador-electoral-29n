import json, sys, subprocess, concurrent.futures as cf
d = json.load(open(sys.argv[1])); out = sys.argv[2]
urls = {}
def add(u, donde):
    if u: urls.setdefault(u, []).append(donde)
for c in d['contrastes']:
    for e in c['evidencias']: add(e.get('url'), c['propuesta_id'] + ':' + str(e.get('id')))
for b in d['balance']:
    add(b.get('cita_url'), b['id'] + ':cita'); add((b.get('dato_actual') or {}).get('url'), b['id'] + ':dato')
    for e in b.get('evidencias', []): add(e.get('url'), b['id'] + ':' + str(e.get('id')))
for p in d['partidos']: add(p['programa'].get('url'), p['id'] + ':programa')
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
def chk(u):
    try:
        r = subprocess.run(["curl", "-s", "-L", "-o", "/dev/null", "--max-time", "25", "-A", UA, "-H", "Accept-Language: es-ES,es;q=0.9", "-w", "%{http_code}", "--", u], capture_output=True, text=True, timeout=40)
        return u, r.stdout.strip() or "000"
    except Exception:
        return u, "000"
res = dict(cf.ThreadPoolExecutor(12).map(chk, urls))
json.dump({u: {"codigo": res[u], "donde": urls[u]} for u in urls}, open(out, "w"), ensure_ascii=False, indent=1)
from collections import Counter
print(len(urls), "enlaces", dict(Counter(res.values())))
