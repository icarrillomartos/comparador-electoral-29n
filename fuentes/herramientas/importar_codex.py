#!/usr/bin/env python3
"""Trae el inventario de medidas de la edición Codex al «programa completo» de esta edición.

Uso: python3 -I importar_codex.py <carpeta_codex_extraida> <fuentes> [clasificacion.json]

Regla: una medida solo entra si se localiza una cita LITERAL suya en el texto del PDF
oficial que ya usa esta edición (mismo archivo, misma huella). El resumen es el de Codex
y se marca como tal. Las que ya están entre las propuestas destacadas no se duplican.
"""
import json
import os
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
C, F = sys.argv[1], sys.argv[2]
CLAS = sys.argv[3] if len(sys.argv) > 3 else None
sys.argv = [sys.argv[0], F, F]          # build.py lee sus rutas de sys.argv al importarse
import build as B  # noqa: E402

PART = {"frente-amplio": "frenteamplio"}
MIOS = {p[0] for p in B.PARTIDOS}
TEMA0 = {"vivienda": "vivienda", "economia": "impuestos", "empleo": "empleo", "sanidad": "sanidad", "educacion": "educacion",
         "inmigracion": "inmigracion", "seguridad": "seguridad", "derechos": "igualdad", "energia": "energia", "territorio": "territorio"}

d = json.load(open(os.path.join(C, "dist", "datos.json"), encoding="utf-8"))
bloques = {}
for f in ("nacional-blocks", "territorial-blocks", "salf-blocks"):
    for b in json.load(open(os.path.join(C, "research", f + ".json"), encoding="utf-8")):
        bloques[b["id"]] = b["text"]
clas = json.load(open(CLAS, encoding="utf-8")) if CLAS and os.path.exists(CLAS) else {}


def frases(t):
    return [x.strip() for x in re.split(r"(?<=[.;:])\s+", t) if len(x.strip()) > 20]


def limpia(c):
    """Cierra la cita en un final de frase si lo hay, para no arrastrar el encabezado siguiente."""
    c = unicodedata.normalize("NFKC", c).strip(" ,;:")
    if not re.search(r"[.!?»”\"]$", c):
        m = [x.end() for x in re.finditer(r"[.!?](?=\s)", c)]
        if m and len(B.norm(c[:m[-1]])) >= 60:
            c = c[:m[-1]]
    return c


def busca_cita(texto, pags_norm, pag):
    """Devuelve (cita literal, página). Prefiere frases completas desde el principio de la medida."""
    orden = sorted(range(len(pags_norm)), key=lambda i: abs(pags_norm[i][0] - pag))
    cands = []
    pal = texto.split()
    fr = frases(texto)
    # 1) una o dos primeras frases completas, si caben
    for n in (2, 1):
        c = " ".join(fr[:n])
        if c and len(c.split()) <= 45:
            cands.append(c)
    for n in (38, 24, 14):
        cands.append(" ".join(pal[:n]))
    # 2) cualquier frase completa, y después su comienzo
    for x in fr:
        w = x.split()
        if len(w) <= 45:
            cands.append(x)
        cands.append(" ".join(w[:38])); cands.append(" ".join(w[:16]))
    # 3) ventanas que empiezan tras un signo de puntuación, y por último cualquier ventana
    ini = [k for k in range(1, max(1, len(pal) - 12)) if re.search(r"[.;:!?]$", pal[k - 1])]
    for k in ini + list(range(0, max(1, len(pal) - 12), 6)):
        cands.append(" ".join(pal[k:k + 14]))
    for c in cands:
        c = limpia(c)
        nc = B.norm(c)
        if len(nc) < 45:
            continue
        for i in orden[:5] + orden[5:]:
            if nc in pags_norm[i][1]:
                return c, pags_norm[i][0]
    return None, None


def crudo_pag(t):
    t = unicodedata.normalize("NFKC", t)
    t = re.sub("\xad\\s*|\u2010\\s+", "", t)
    t = re.sub(r"(?<=\w)-[ \t]*\n\s*(?=[a-záéíóúüñçàèòï])", "", t)
    return re.sub(r"\s+", " ", t)


def ensancha(cita, pag, pags, pags_norm):
    """Si la cita empieza o acaba a media frase, la amplía sobre el texto del PDF hasta los límites de la frase."""
    ini_mal = re.match(r"[a-záéíóúñçàèò]", cita) is not None
    fin_mal = re.search(r"[.!?»”\")]$", cita) is None
    if not (ini_mal or fin_mal):
        return cita
    k = next((i for i, (n, _) in enumerate(pags) if n == pag), None)
    if k is None:
        return cita
    t = crudo_pag(pags[k][1] + " " + (pags[k + 1][1] if k + 1 < len(pags) else ""))
    pal = cita.split()
    m = re.search(r"\s+".join(re.escape(w) for w in pal), t)
    if not m:
        return cita
    a, z = m.start(), m.end()
    if ini_mal:
        prev = [x.end() for x in re.finditer(r"[.!?:;]\s+|\s\d{1,3}\.\s+|[•●▪]\s*", t[max(0, a - 260):a])]
        if prev:
            a = max(0, a - 260) + prev[-1]
    if fin_mal:
        sig = re.search(r"[.!?](?=\s|$)", t[z:z + 220])
        if sig:
            z = z + sig.end()
    nueva = t[a:z].strip(" ,;:")
    if len(nueva.split()) > 60 or len(nueva.split()) < 6:
        return cita
    nn = B.norm(nueva)
    if any(n == pag and nn in tx for n, tx in pags_norm):
        return nueva
    return cita


salida, cuenta = [], {}
for pid_c in sorted({p["party"] for p in d["proposals"]}):
    pid = PART.get(pid_c, pid_c)
    st = cuenta.setdefault(pid, {"codex": 0, "sin_texto": 0, "sin_cita": 0, "ya_destacada": 0, "repetida": 0, "entra": 0})
    props = [p for p in d["proposals"] if p["party"] == pid_c]
    st["codex"] = len(props)
    if pid not in MIOS:
        st["fuera"] = "partido no incluido en esta edición"
        continue
    pags = B.cargar_paginas(pid)
    pn = []
    for i, (n, t) in enumerate(pags):
        pn.append((n, B.norm(t + "\n" + (pags[i + 1][1] if i + 1 < len(pags) else ""))))
    mios = json.load(open(os.path.join(F, "datos-investigacion", pid + ".json"), encoding="utf-8"))["propuestas"]
    mias_citas = [(m["id"], [t for t in (B.norm(x) for x in re.split(r"\[\.\.\.\]|\(\.\.\.\)|…|\.\.\.", m.get("cita", ""))) if len(t) > 12]) for m in mios]
    vistas = set()
    for p in props:
        ref = (p.get("fullTextRef") or "").split("#")[-1]
        texto = bloques.get(ref) or bloques.get(p["id"]) or bloques.get(p.get("inventoryId") or "")
        if not texto:
            st["sin_texto"] += 1; continue
        nt = B.norm(texto)
        dup = next((mid for mid, tr in mias_citas if tr and tr[0][:60] in nt), None)
        if dup:
            st["ya_destacada"] += 1; continue
        cita, pg = busca_cita(texto, pn, int(p.get("page") or 1))
        if not cita:
            st["sin_cita"] += 1; continue
        cita = ensancha(cita, pg, pags, pn)
        ncita = B.norm(cita)
        if any(tr and (ncita[:50] in " ".join(tr) or tr[0][:50] in ncita) for _, tr in mias_citas):
            st["ya_destacada"] += 1; continue
        clave = B.norm(cita)[:80]
        if clave in vistas:
            st["repetida"] += 1; continue
        vistas.add(clave)
        k = clas.get("x-" + p["id"]) or clas.get(p["id"]) or {}
        tit = (k.get("titulo") or p["title"]).strip()
        res = p["summary"].strip()
        if not k.get("titulo") and (tit.endswith("…") or (len(tit) > 70 and B.norm(res).startswith(B.norm(tit.rstrip("…"))[:40]) and len(res) > len(tit))):
            tit = res
        salida.append({"id": "x-" + p["id"], "partido": pid, "tema": k.get("tema") or TEMA0.get(p["topic"], "territorio"),
                       "tema_codex": p["topic"], "titulo": tit, "resumen": "" if B.norm(res) == B.norm(tit) else res,
                       "cita": cita, "pagina": pg, "contrastada_codex": p.get("contrastStatus") == "specific_evidence"})
        st["entra"] += 1

json.dump({"origen": "Inventario de medidas de la edición Codex v2/v3 (24-11-2026). Resumen de Codex; cita literal localizada por esta edición en el PDF oficial.",
           "recuento": cuenta, "medidas": salida},
          open(os.path.join(F, "datos-investigacion", "programa-completo.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for k, v in cuenta.items():
    print(k, v)
print("total", len(salida))
