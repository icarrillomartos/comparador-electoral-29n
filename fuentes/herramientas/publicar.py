#!/usr/bin/env python3
"""Reconstruye y publica el Comparador 29N desde la carpeta de la entrega.

Uso: python3 publicar.py <carpeta_salida_temporal> [carpeta_vista_previa] [carpeta_registros_auditoria]
Lee fuentes/ (datos-investigacion, texto-programas, programas), ejecuta build.py,
genera metodologia.md y copia index.html, datos.json y metodologia.md a la entrega.
"""
import glob
import json
import os
import shutil
import subprocess
import sys

T = os.path.dirname(os.path.abspath(__file__))
W = os.path.dirname(T)                      # fuentes/
DEST = os.path.dirname(W)                   # carpeta de la entrega
OUT = sys.argv[1]
PREV = sys.argv[2] if len(sys.argv) > 2 else None
AUD = sys.argv[3] if len(sys.argv) > 3 else None

r = subprocess.run([sys.executable, "-I", os.path.join(T, "build.py"), W, OUT], capture_output=True, text=True)
print(r.stdout.strip())
print(r.stderr[-600:])
d = json.load(open(os.path.join(OUT, "datos.json"), encoding="utf-8"))
todo = d["contrastes"] + d["balance"]
PC = d.get("programa", [])
nev = sum(len(c.get("evidencias", [])) for c in todo)
nver = sum(1 for c in todo for e in c.get("evidencias", []) if e.get("verificado"))
rec = (f"- {len(d['propuestas'])} propuestas de {sum(1 for p in d['partidos'] if p['n_propuestas'])} programas oficiales, "
       f"en {len(d['temas'])} temas, todas con cita literal localizada en el PDF.\n" +
       (f"- {len(PC)} medidas más en el segundo nivel («programa completo»), con cita literal localizada en el PDF.\n" if PC else "") +
       f"- {len(d['contrastes'])} promesas contrastadas (" + ", ".join(f"{p['corto']} {p['n_contrastes']}" for p in d['partidos'] if p['n_contrastes']) + ").\n"
       f"- {len(d['balance'])} compromisos en el balance desde 2018.\n"
       f"- {len(d.get('espana', {}).get('indicadores', []))} indicadores en «España en datos».\n"
       f"- {nev} evidencias enlazadas; en {nver} el investigador, el revisor o el auditor abrió la URL y comprobó su contenido.")
prog = "| Partido | Documento | Págs. | SHA-256 | URL |\n|---|---|---|---|---|\n" + "\n".join(
    f"| {p['corto']} | {p['programa'].get('titulo','')} | {p['programa'].get('paginas','')} | `{p['programa'].get('sha256','')[:16]}` | {p['programa'].get('url','')} |" for p in d["partidos"])

# Profundidad por partido, calculada sobre los datos publicados
filas = []
for p in d["partidos"]:
    cs = [c for c in d["contrastes"] if c["partido"] == p["id"]]
    if not cs:
        continue
    ev = [e for c in cs for e in c["evidencias"]]
    a = sum(1 for e in ev if e["sentido"] == "apoya"); n = sum(1 for e in ev if e["sentido"] == "contradice")
    media = sum(c["indice"]["valor"] for c in cs) / len(cs)
    filas.append((p["corto"], len(ev), n, a, n / a if a else 0, media))
ncs = sorted({p["n_contrastes"] for p in d["partidos"] if p["n_contrastes"]})
prof = ("- **La profundidad no es idéntica entre partidos.** " + (f"Todos tienen {ncs[0]} promesas contrastadas" if len(ncs) == 1 else "El número de promesas contrastadas va de " + str(ncs[0]) + " a " + str(ncs[-1])) + ", pero el número de evidencias y la proporción "
        "de evidencias en contra frente a evidencias a favor varían. Quien gobierna acumula más hechos comprobables, a favor y en contra, que quien no ha gobernado.\n\n"
        "  | Partido | Evidencias | En contra | A favor | En contra por cada una a favor | Índice medio |\n  |---|---|---|---|---|---|\n" +
        "\n".join(f"  | {c} | {t} | {n} | {a} | {str(round(q, 1)).replace('.', ',')} | {str(round(m, 1)).replace('.', ',')} |" for c, t, n, a, q, m in filas))

E = d.get("espana", {}).get("indicadores", [])
cu = lambda s: sum(1 for i in E if i["sentido"] == s)
esp = (f"{len(E)} indicadores de fuentes oficiales (INE, Eurostat, Seguridad Social, ministerios, Red Eléctrica, Transparencia Internacional): "
       f"{cu('mejora')} mejoran, {cu('empeora')} empeoran y {cu('neutro') + cu('igual')} quedan sin valorar. "
       f"En {sum(1 for i in E if not i.get('verificado'))} el dato de 2018 procede de prensa que cita la fuente oficial y va marcado.")

FO = d.get("espana", {}).get("fondo", [])
fon = (f"{sum(len(b['analisis']) for b in FO)} análisis en {len(FO)} bloques (" + ", ".join(f"{b['bloque']} {len(b['analisis'])}" for b in FO) + "), con "
       f"{sum(len(a['indicadores']) for b in FO for a in b['analisis'])} indicadores y {sum(len(a['tablas']) for b in FO for a in b['analisis'])} tablas. "
       f"{sum(1 for b in FO for a in b['analisis'] for i in a['indicadores'] if not i.get('verificado'))} indicadores proceden de prensa que cita la fuente oficial y van marcados; "
       f"{sum(1 for b in FO for a in b['analisis'] for i in a['indicadores'] if i.get('calculo_propio'))} son cálculos propios con datos oficiales.")
cx_p = "Esta edición no incorpora un segundo nivel de medidas."
cx = "- No se ha incorporado nada."
ruta_pc = os.path.join(W, "datos-investigacion", "programa-completo.json")
if PC and os.path.exists(ruta_pc):
    rc = json.load(open(ruta_pc, encoding="utf-8"))["recuento"]
    tot = sum(v["codex"] for v in rc.values())
    cx_p = (f"Debajo de las destacadas, cada partido tiene un desplegable con el resto de medidas de su programa: {len(PC)} en total. "
            "Proceden del inventario de la edición Codex (ver «Lo incorporado de la edición Codex»). El título y el resumen son de Codex "
            "(los títulos largos o en otra lengua se han acortado o traducido aquí); la clasificación en los 14 temas es de esta edición; "
            "la cita literal la ha localizado esta edición en el mismo PDF oficial, con la misma comprobación automática. "
            "No llevan grado de concreción ni contraste.\n\n"
            "| Partido | En Codex | Entran | Ya estaban entre las destacadas | Sin texto o sin cita localizada | Repetidas |\n|---|---|---|---|---|---|\n" +
            "\n".join(f"| {k} | {v['codex']} | {v['entra']} | {v['ya_destacada']} | {v['sin_texto'] + v['sin_cita']} | {v['repetida']} |" + (" (partido no incluido en esta edición)" if v.get('fuera') else "") for k, v in rc.items()))
    amp = {}
    for fa in sorted(glob.glob(os.path.join(W, "datos-investigacion", "ampliacion-*.json"))):
        amp[os.path.basename(fa)[11:-5]] = json.load(open(fa, encoding="utf-8"))
    nn = sum(len(a.get("contrastes_nuevos", [])) for a in amp.values())
    ne = sum(len(a.get("evidencias_para_existentes", [])) for a in amp.values())
    nb = len((amp.get("balance") or {}).get("compromisos_nuevos", []))
    cx = (f"- **Propuestas.** De las {tot} medidas del inventario de Codex se incorporan {len(PC)} como segundo nivel, solo las que tienen cita literal localizada en el mismo PDF (misma huella SHA-256). El detalle por partido está en «El programa completo».\n"
          f"- **Contrastes.** Los expedientes de Codex se usaron como pista, no como prueba. Un investigador por partido eligió siete promesas nuevas, abrió cada fuente antes de darla por verificada, buscó el historial y la refutación en los dos sentidos (que el método de Codex no recoge) y puntuó con los anclajes de esta edición: {nn} contrastes nuevos. Además se añadieron {ne} evidencias comprobadas a contrastes que ya existían.\n"
          f"- **Balance desde 2018.** {nb} compromisos nuevos, elegidos entre los 95 de Codex y rehechos con cita literal y fuentes abiertas.\n"
          "- **Revisión independiente de lo añadido.** Un auditor comparó los niveles de los 42 contrastes nuevos entre partidos y con los 42 anteriores: no encontró un sesgo sistemático, pero sí listones distintos entre investigadores, y propuso ocho ajustes de un nivel (cinco a la baja y tres al alza) que se aplicaron y constan en «Ajustes editoriales de nivel». Un verificador abrió 108 fuentes (14 evidencias por partido y 24 elementos del balance): ninguna discrepancia y ocho matices de fecha, cita o actualización, ya corregidos. También confirmó tres correcciones a datos anteriores (serie revisada de vivienda protegida de 2025, investigación de la Fiscalía Europea sobre las pulseras y levantamiento de la inmunidad de Alvise Pérez). Informes: `auditoria-ampliacion-equidad.json` y `auditoria-ampliacion-verificacion.json`.\n"
          "- **Por qué cambian las medias.** En la primera selección el Frente Amplio promediaba más que el PP; en la ampliación ocurre lo contrario. Según el auditor, se debe a qué promesas se eligieron (las nuevas del PP son más de procedimiento y más viables; las del Frente Amplio y Podemos son en su mayoría compromisos de 2019-2023 que no salieron adelante), no al listón.\n"
          "- Los informes de cada investigador, con lo descartado y lo que no pudo verificarse, están en `fuentes/datos-investigacion/ampliacion-*.json`.")
aud = "- El registro detallado de cambios no está disponible en esta construcción."
if AUD and os.path.isdir(AUD):
    lin = []
    for f in sorted(glob.glob(os.path.join(AUD, "*-aplicado.json"))):
        x = json.load(open(f, encoding="utf-8"))
        nombre = os.path.basename(f).replace("-aplicado.json", "")
        lin.append(f"- `{nombre}`: {len(x.get('aplicados', []))} correcciones aplicadas, {len(x.get('no_aplicados', []))} hallazgos no aplicados por falta de fuente abierta o confianza baja.")
        shutil.copy(f, os.path.join(W, "datos-investigacion", "auditoria-" + os.path.basename(f)))
    for f in sorted(glob.glob(os.path.join(AUD, "*.json"))):
        if not f.endswith("-aplicado.json") and "backup" not in f:
            shutil.copy(f, os.path.join(W, "datos-investigacion", "auditoria-" + os.path.basename(f)))
    aud = "\n".join(lin) + "\n\nLos informes completos y los registros de cambios están en `fuentes/datos-investigacion/auditoria-*.json`."

inc = open(os.path.join(OUT, "informe-build.txt"), encoding="utf-8").read().strip()
extra = ""
if os.path.exists(os.path.join(W, "enlaces.json")):
    extra = ("\n\n## Comprobación de enlaces\n\nLa comprobación automática de enlaces se hizo sobre la primera versión (374 de 391 respondían; el resto eran webs que bloquean "
             "peticiones automáticas y una muestra se abrió a mano). Las evidencias añadidas en la auditoría las abrió el auditor, salvo las marcadas «Enlace sin verificar».")
aj = json.load(open(os.path.join(T, "calibrar.json"), encoding="utf-8"))["ajustes"]
cal = ("\n\n## Ajustes editoriales de nivel\n\nPara aplicar el mismo anclaje a todos los partidos, el editor cambió estos niveles respecto a la propuesta del investigador. "
       "El motivo aparece también en la ficha.\n\n" + "\n".join(f"- `{a['id']}` · {a['componente']} → {a['nivel']}. {a['motivo']}" for a in aj))
m = open(os.path.join(T, "metodologia.plantilla.md"), encoding="utf-8").read()
for k, v in (("{{FECHA}}", "24 de noviembre de 2026"), ("{{RECUENTO}}", rec), ("{{PROGRAMAS}}", prog), ("{{PROFUNDIDAD}}", prof),
             ("{{ESPANA}}", esp), ("{{CODEX_PROPUESTAS}}", cx_p), ("{{CODEX}}", cx), ("{{FONDO}}", fon), ("{{AUDITORIA}}", aud),
             ("{{INCIDENCIAS}}", "## Incidencias de la última construcción\n\n" + (("```\n" + inc + "\n```") if inc else "Ninguna.") + extra + cal)):
    m = m.replace(k, v)
assert "{{" not in m, "queda un marcador sin sustituir"
open(os.path.join(OUT, "metodologia.md"), "w", encoding="utf-8").write(m)
for dest in filter(None, [DEST, PREV]):
    os.makedirs(dest, exist_ok=True)
    for f in ("index.html", "datos.json", "metodologia.md"):
        shutil.copy(os.path.join(OUT, f), dest)
print("publicado en", DEST)
for fila in filas:
    print("  ", fila)
