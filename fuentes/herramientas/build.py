#!/usr/bin/env python3
"""Construye datos.json e index.html del Comparador 29N a partir de datos/*.json.

Uso: python3 build.py <carpeta_trabajo> <carpeta_salida>
Valida citas contra el texto de los programas, calcula el índice de plausibilidad
con la fórmula publicada en metodologia.md y deja un informe de incidencias.
"""
import hashlib
import json
import os
import re
import sys
import unicodedata

W, OUT = sys.argv[1], sys.argv[2]
def _dir(*nombres):
    for n in nombres:
        if os.path.isdir(os.path.join(W, n)):
            return os.path.join(W, n)
    return os.path.join(W, nombres[0])


# admite la carpeta de trabajo original (datos/, texto/) y la de la entrega (fuentes/)
DATOS, TEXTO, PROG = _dir("datos", "datos-investigacion"), _dir("texto", "texto-programas"), _dir("programas")

TEMAS = [
    ("vivienda", "Vivienda"), ("impuestos", "Impuestos y economía"), ("empleo", "Empleo y salarios"),
    ("pensiones", "Pensiones"), ("sanidad", "Sanidad"), ("educacion", "Educación"),
    ("inmigracion", "Inmigración"), ("seguridad", "Seguridad y justicia penal"),
    ("igualdad", "Igualdad y derechos"), ("energia", "Energía, clima y campo"),
    ("corrupcion", "Corrupción"), ("instituciones", "Instituciones y justicia"), ("territorio", "Modelo territorial"),
    ("exterior", "Defensa y exterior"),
]
PARTIDOS = [
    # id, nombre, corto, candidato, color, ámbito, a_fondo
    ("pp", "Partido Popular", "PP", "Alberto Núñez Feijóo", "#1d84ce", "nacional", True),
    ("psoe", "PSOE", "PSOE", "Pedro Sánchez", "#e30613", "nacional", True),
    ("vox", "Vox", "Vox", "Santiago Abascal", "#5aab1e", "nacional", True),
    ("frenteamplio", "Frente Amplio", "Frente Amplio", "Ada Colau", "#d6336c", "nacional", True),
    ("podemos", "Podemos", "Podemos", "Irene Montero", "#6b2c8a", "nacional", True),
    ("salf", "Se Acabó La Fiesta", "SALF", "Alvise Pérez", "#8a6d1a", "nacional", True),
    ("erc", "Esquerra Republicana", "ERC", "Gabriel Rufián", "#e0a100", "Cataluña", False),
    ("junts", "Junts per Catalunya", "Junts", "Míriam Nogueras", "#00a99d", "Cataluña", False),
    ("pnv", "EAJ-PNV", "PNV", "Maribel Vaquero", "#2e7d32", "País Vasco", False),
    ("ehbildu", "EH Bildu", "EH Bildu", "Oskar Matute", "#7a9a01", "País Vasco y Navarra", False),
    ("bng", "BNG", "BNG", "Néstor Rego", "#4a90c2", "Galicia", False),
    ("cc", "Coalición Canaria", "CC", "Cristina Valido", "#c9a400", "Canarias", False),
    ("compromis", "Compromís – Front Valencià", "Compromís", "Àgueda Micó", "#e0641a", "C. Valenciana", False),
]

# ---- Fórmula del índice de plausibilidad (ver metodologia.md) ----
PESOS = {"historial": 30, "viabilidad": 25, "coherencia": 20, "datos": 15, "concrecion": 10}
ETIQUETAS = [(75, "Muy plausible"), (60, "Plausible"), (45, "Dudosa"), (25, "Poco plausible"), (0, "Muy poco plausible")]


def concrecion_valor(c):
    c = c or {}
    return 25 * sum(1 for k in ("cifra", "plazo", "financiacion", "instrumento") if c.get(k))


def indice(puntos, concrecion, evidencias):
    """Devuelve dict con valor, margen, etiqueta, desglose y topes aplicados."""
    comp = {}
    for k in ("historial", "coherencia", "viabilidad", "datos"):
        p = (puntos or {}).get(k) or {}
        n = p.get("nivel")
        comp[k] = {"nivel": n, "valor": None if n is None else 25 * int(n), "por": p.get("por", "")}
    kv = concrecion_valor(concrecion)
    comp["concrecion"] = {"nivel": kv // 25, "valor": kv, "por": "Elementos concretos en el texto del programa: " + (
        ", ".join(n for k, n in (("cifra", "cifra medible"), ("plazo", "plazo"), ("financiacion", "cómo se paga"),
                                  ("instrumento", "instrumento legal")) if (concrecion or {}).get(k)) or "ninguno")}
    # Sin historial (nunca tuvieron poder sobre el asunto): cuenta como neutro (50), ni suma ni resta.
    base = sum(PESOS[k] * (50 if v["valor"] is None else v["valor"]) for k, v in comp.items()) / 100
    for k in comp:
        comp[k]["peso"] = PESOS[k]
    topes, valor = [], base
    nv, nh = comp["viabilidad"]["nivel"], comp["historial"]["nivel"]
    if nv == 0 and valor > 20:
        valor = 20; topes.append("Tope 20: tal como está escrita exige una reforma constitucional agravada o es jurídicamente inviable.")
    elif nv == 1 and valor > 45:
        valor = 45; topes.append("Tope 45: choca con el derecho de la UE, con el Tribunal Constitucional o exige mayorías muy difíciles.")
    if nh == 0 and valor > 50:
        valor = 50; topes.append("Tope 50: ya lo prometieron con poder para hacerlo y no lo hicieron, o hicieron lo contrario.")
    ev = evidencias or []
    verif = [e for e in ev if e.get("verificado")]
    apoya = sum(1 for e in ev if e.get("sentido") == "apoya")
    contra = sum(1 for e in ev if e.get("sentido") == "contradice")
    margen, motivos = 6, ["margen base ±6"]
    if nh is None:
        margen += 6; motivos.append("+6: nunca han tenido poder sobre este asunto, no hay historial que medir")
    if len(verif) < 4:
        margen += 4; motivos.append("+4: menos de cuatro evidencias verificadas")
    if any(e.get("fuente_unica") or not e.get("verificado") for e in ev):
        margen += 2; motivos.append("+2: alguna evidencia sin verificar o de fuente única")
    if apoya >= 2 and contra >= 2:
        margen += 2; motivos.append("+2: evidencia sólida en los dos sentidos")
    valor = int(valor + 0.5)  # redondeo habitual: ,5 hacia arriba
    etiqueta = next(t for lim, t in ETIQUETAS if valor >= lim)
    return {"valor": valor, "base": round(base, 1), "margen": margen, "etiqueta": etiqueta,
            "componentes": comp, "topes": topes, "margen_por": motivos}


# ---- Validación de citas ----
def norm(s):
    s = unicodedata.normalize("NFKC", s or "")
    s = re.sub("\xad\\s*", "", s)   # guion blando de corte de línea
    s = re.sub("\u2010\\s+", "", s)   # guion tipográfico de corte de línea
    s = re.sub(r"(\w)-\s+(?=[a-záéíóúüñçàèòïl·])", r"\1", s)   # palabras partidas a final de línea
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').replace("«", '"').replace("»", '"')
    s = re.sub(r"[•●▪◦·]", " ", s)
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s


def cargar_paginas(pid):
    ruta = os.path.join(TEXTO, pid + ".txt")
    if not os.path.exists(ruta):
        return None
    bruto = open(ruta, encoding="utf-8").read()
    partes = re.split(r"\n*===== PÁGINA (\d+) =====\n", bruto)
    pags = [(int(partes[i]), partes[i + 1]) for i in range(1, len(partes) - 1, 2)]
    return pags


def localizar(cita, pags):
    """Página del PDF donde aparece la cita (admite cortes con … y citas a caballo entre dos páginas)."""
    trozos = [t for t in (norm(x) for x in re.split(r"\[\.\.\.\]|\(\.\.\.\)|…|\.\.\.", cita)) if len(t) > 12]
    if not trozos:
        return None
    for i, (n, t) in enumerate(pags):
        doble = norm(t + "\n" + (pags[i + 1][1] if i + 1 < len(pags) else ""))
        if all(tr in doble for tr in trozos):
            return n if trozos[0] in norm(t) or len(trozos[0]) < 30 else (n if trozos[0][:30] in norm(t) else n + 1)
    return None


def sha(ruta):
    h = hashlib.sha256()
    with open(ruta, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def url_ok(u):
    return isinstance(u, str) and re.match(r"^https?://[^\s]+$", u) is not None


AJUSTES = []


def main():
    ruta_aj = os.path.join(os.path.dirname(os.path.abspath(__file__)), "calibrar.json")
    if os.path.exists(ruta_aj):
        AJUSTES.extend(json.load(open(ruta_aj, encoding="utf-8"))["ajustes"])
    informe, salida = [], {"generado": None, "temas": [{"id": i, "nombre": n} for i, n in TEMAS],
                           "pesos": PESOS, "partidos": [], "propuestas": [], "contrastes": [], "balance": []}
    temas_ok = {i for i, _ in TEMAS}
    for pid, nombre, corto, cand, color, ambito, fondo in PARTIDOS:
        ruta = os.path.join(DATOS, pid + ".json")
        d = json.load(open(ruta, encoding="utf-8")) if os.path.exists(ruta) else None
        pdf = os.path.join(PROG, pid + ".pdf")
        prog = dict((d or {}).get("programa") or {})
        if os.path.exists(pdf):
            prog["sha256"] = sha(pdf)
        pags = cargar_paginas(pid)
        if pags:
            prog["paginas"] = len(pags)
        part = {"id": pid, "nombre": nombre, "corto": corto, "candidato": cand, "color": color, "ambito": ambito,
                "a_fondo": fondo, "programa": prog, "nota": (d or {}).get("nota", ""), "n_propuestas": 0, "n_contrastes": 0}
        if d is None:
            informe.append(f"[{pid}] sin archivo de datos")
            salida["partidos"].append(part)
            continue
        ids = set()
        for p in d.get("propuestas", []):
            if p.get("tema") not in temas_ok:
                informe.append(f"[{pid}] tema desconocido en {p.get('id')}: {p.get('tema')}"); continue
            p["partido"] = pid
            cita_limpia = re.sub(r"(\w)-\s+(?=[a-záéíóúüñçàèòï])", r"\1", p.get("cita", ""))
            if pags:
                pg = localizar(p.get("cita", ""), pags)
                p["cita_ok"] = pg is not None
                if pg is None:
                    informe.append(f"[{pid}] CITA NO ENCONTRADA {p.get('id')}: {p.get('cita','')[:70]}")
                else:
                    if p.get("pagina") != pg:
                        p["pagina_declarada"] = p.get("pagina")
                    p["pagina"] = pg
                    crudo = re.sub(r"\s+", " ", re.sub(r"(?<=\w)-[ \t]*\n\s*(?=[a-záéíóúüñ])", "", re.sub("\xad\\s*|\u2010\\s+", "", " ".join(t for _, t in pags))))
                    original = re.sub(r"\s+", " ", p.get("cita", "")).strip()
                    # solo se unen palabras partidas si la cita tal cual no está en el PDF
                    p["cita"] = original if original in crudo else re.sub(r"\s+", " ", cita_limpia).strip()
            else:
                p["cita_ok"] = None
                if not url_ok(p.get("url")):
                    informe.append(f"[{pid}] propuesta sin PDF local ni URL: {p.get('id')}")
            if p.get("id") in ids:
                informe.append(f"[{pid}] id duplicado {p.get('id')}")
            ids.add(p.get("id"))
            salida["propuestas"].append(p)
            part["n_propuestas"] += 1
        for c in d.get("contrastes", []):
            c["partido"] = pid
            prop = next((p for p in d.get("propuestas", []) if p.get("id") == c.get("propuesta_id")), None)
            if prop is None:
                informe.append(f"[{pid}] contraste sin propuesta: {c.get('propuesta_id')}"); continue
            c["tema"] = prop["tema"]
            evs = []
            for e in c.get("evidencias", []):
                if not url_ok(e.get("url")):
                    informe.append(f"[{pid}] evidencia sin URL válida en {c['propuesta_id']}: {e.get('titulo')}"); continue
                evs.append(e)
            c["evidencias"] = evs
            if len(evs) < 5:
                informe.append(f"[{pid}] {c['propuesta_id']}: solo {len(evs)} evidencias")
            for aj in AJUSTES:
                if aj["id"] == c["propuesta_id"] and c.get("puntos", {}).get(aj["componente"]) is not None:
                    pt = c["puntos"][aj["componente"]]
                    if pt.get("nivel") != aj["nivel"]:
                        pt["nivel_investigador"] = pt.get("nivel"); pt["nivel"] = aj["nivel"]
                        pt["por"] = (pt.get("por", "").rstrip() + " " + aj["motivo"]).strip()
            c["indice"] = indice(c.get("puntos"), prop.get("concrecion"), evs)
            c.pop("puntos", None)
            salida["contrastes"].append(c)
            part["n_contrastes"] += 1
        salida["partidos"].append(part)

    ruta = os.path.join(DATOS, "balance2018.json")
    if os.path.exists(ruta):
        b = json.load(open(ruta, encoding="utf-8"))
        pags = cargar_paginas("psoe")
        for c in b.get("compromisos", []):
            c["evidencias"] = [e for e in c.get("evidencias", []) if url_ok(e.get("url"))]
            pr = c.get("promesa_2026")
            if pr and pr.get("cita") and pags:
                pg = localizar(pr["cita"], pags)
                pr["cita_ok"] = pg is not None
                if pg is None:
                    informe.append(f"[balance] CITA 2026 NO ENCONTRADA {c.get('id')}: {pr['cita'][:70]}")
                else:
                    pr["pagina"] = pg
            c["indice"] = indice(c.get("puntos"), c.get("concrecion"), c["evidencias"]) if pr and c.get("puntos") else None
            c.pop("puntos", None)
            if not url_ok(c.get("cita_url")):
                informe.append(f"[balance] {c.get('id')} sin URL de la cita original")
            salida["balance"].append(c)
        salida["balance_nota"] = b.get("nota_metodo", "")
    else:
        informe.append("[balance] sin archivo de datos")

    # ---- España en datos: 2018 frente al último dato ----
    ruta = os.path.join(DATOS, "espana-datos.json")
    if os.path.exists(ruta):
        e = json.load(open(ruta, encoding="utf-8"))
        def preparar(lista, donde):
            inds = []
            for i in lista or []:
                a, b = i.get("valor_2018"), i.get("valor_actual")
                if (a is None or a == 0) and isinstance(b, (int, float)) and url_ok(i.get("url")):
                    i["cambio_pct"] = None; i["cambio_puntos"] = None; i["sentido"] = "unico"   # dato sin punto de partida en 2018
                    inds.append(i); continue
                if not isinstance(a, (int, float)) or not isinstance(b, (int, float)) or a == 0 or not url_ok(i.get("url")):
                    informe.append(f"[{donde}] indicador descartado (sin valores o sin URL): {i.get('id')}"); continue
                i["cambio_pct"] = round((b - a) / abs(a) * 100, 1)
                i["cambio_puntos"] = round(b - a, 2) if i.get("es_tasa") else None
                ms = i.get("mejor_si", "neutro")
                i["sentido"] = "neutro" if ms not in ("sube", "baja") else "igual" if b == a else \
                    "mejora" if (b > a) == (ms == "sube") else "empeora"
                inds.append(i)
            return inds

        salida["espana"] = {"indicadores": preparar(e.get("indicadores"), "espana"), "advertencia": e.get("advertencia_general", ""), "fondo": []}
        ruta_f = os.path.join(DATOS, "espana-fondo.json")
        if os.path.exists(ruta_f):
            vistos = set()
            for bl in json.load(open(ruta_f, encoding="utf-8")).get("bloques", []):
                ans = []
                for an in bl.get("analisis", []):
                    if not an.get("id") or an["id"] in vistos:
                        informe.append(f"[fondo] análisis sin id o duplicado: {an.get('id')}"); continue
                    vistos.add(an["id"])
                    an["indicadores"] = preparar(an.get("indicadores"), "fondo " + an["id"])
                    tabs = []
                    for tb in an.get("tablas") or []:
                        if not url_ok(tb.get("url")) or not tb.get("filas") or not tb.get("columnas"):
                            informe.append(f"[fondo {an['id']}] tabla descartada (sin URL o vacía): {tb.get('titulo')}"); continue
                        tabs.append(tb)
                    an["tablas"] = tabs
                    an["ojo"] = [o for o in (an.get("ojo") or []) if o]
                    ans.append(an)
                if ans:
                    salida["espana"]["fondo"].append({"bloque": bl.get("bloque", ""), "analisis": ans})

    # ---- Programa completo: medidas del inventario de la edición Codex, con cita validada aquí ----
    ruta = os.path.join(DATOS, "programa-completo.json")
    salida["programa"] = []
    if os.path.exists(ruta):
        pc = json.load(open(ruta, encoding="utf-8"))
        cache, fuera, ids_pc = {}, 0, set()
        por = {p["id"]: p for p in salida["partidos"]}
        for m in pc.get("medidas", []):
            pid = m.get("partido")
            if pid not in por or m.get("tema") not in temas_ok or m.get("id") in ids_pc:
                fuera += 1; continue
            if pid not in cache:
                pg = cargar_paginas(pid) or []
                cache[pid] = [(n, norm(t + "\n" + (pg[i + 1][1] if i + 1 < len(pg) else ""))) for i, (n, t) in enumerate(pg)]
            nc = norm(m.get("cita", ""))
            pag = next((n for n, t in cache[pid] if n == m.get("pagina") and nc in t), None) or next((n for n, t in cache[pid] if nc in t), None)
            if len(nc) < 40 or pag is None or not (m.get("titulo") or "").strip():
                fuera += 1; continue
            ids_pc.add(m["id"])
            salida["programa"].append({"id": m["id"], "partido": pid, "tema": m["tema"], "titulo": m["titulo"].strip(),
                                       "resumen": (m.get("resumen") or "").strip(), "cita": m["cita"], "pagina": pag})
            por[pid]["n_programa"] = por[pid].get("n_programa", 0) + 1
        salida["programa_origen"] = pc.get("origen", "")
        if fuera:
            informe.append(f"[programa completo] {fuera} medidas descartadas (sin cita localizada, tema o partido no válido, o repetidas)")

    salida["generado"] = os.environ.get("FECHA", "2026-11-24")
    os.makedirs(OUT, exist_ok=True)
    js = json.dumps(salida, ensure_ascii=False, separators=(",", ":"))
    open(os.path.join(OUT, "datos.json"), "w", encoding="utf-8").write(json.dumps(salida, ensure_ascii=False, indent=1))
    plantilla = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "plantilla.html"), encoding="utf-8").read()
    html = plantilla.replace("/*__DATOS__*/null", js.replace("</", "<\\/"))
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(html)
    open(os.path.join(OUT, "informe-build.txt"), "w", encoding="utf-8").write("\n".join(informe) + "\n")
    print(f"partidos={len(salida['partidos'])} propuestas={len(salida['propuestas'])} contrastes={len(salida['contrastes'])} "
          f"balance={len(salida['balance'])} programa_completo={len(salida['programa'])} incidencias={len(informe)} html={len(html)//1024}KB")
    for linea in informe[:60]:
        print(" ", linea)


if __name__ == "__main__":
    main()
