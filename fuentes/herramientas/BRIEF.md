# Comparador 29N · reglas comunes de investigación

Contexto: España celebra elecciones generales el domingo 29 de noviembre de 2026 (convocadas el 5-10-2026 tras caer en el Congreso dos decretos-ley de vivienda). Hoy es 24-11-2026. Estamos construyendo un comparador para ciudadanos con tres piezas: (1) propuestas por tema, (2) «ejercicio de contraste» de promesas concretas contra hechos, (3) balance de compromisos de Pedro Sánchez desde 2018.

Tu conocimiento de 2026 puede estar incompleto o desfasado: **todo hecho posterior a 2025 debes comprobarlo buscando en la web**, no de memoria.

Carpeta de trabajo: `/Users/ivancarrillo/Documents/second-brain-ivan-5.1/scratch/469740e6b2a1edea/`
- `texto/<partido>.txt`: texto de cada programa oficial, con marcas `===== PÁGINA n =====` (n = página del PDF).
- `datos/`: aquí escribes tu JSON de salida. No toques nada más. No escribas fuera de `datos/`.

## Principio rector: mismo listón para todos

Esta herramienta no pone a nadie de bueno ni de malo. Aplicas exactamente el mismo rigor y la misma dureza al partido que te toque que la que aplicarías a su rival. Describe **hechos comprobables**, nunca intenciones ni adjetivos («hipócrita», «mentiroso», «populista» están prohibidos en tu texto: el lector juzga). Sé incisivo en los hechos, no en los calificativos.

## Temas (usa exactamente estos ids)

`vivienda`, `impuestos` (economía y fiscalidad), `empleo` (trabajo, salarios, autónomos), `pensiones`, `sanidad`, `educacion`, `inmigracion`, `seguridad` (seguridad ciudadana, ocupación, justicia penal), `igualdad` (mujer, violencia de género, LGTBI, familia, derechos civiles), `energia` (energía, clima, campo), `instituciones` (corrupción, regeneración, justicia, medios), `territorio` (modelo territorial, Cataluña, financiación autonómica), `exterior` (defensa, UE, política exterior).

## Propuestas (pieza 1)

Por cada tema, las 2-4 propuestas más relevantes y concretas del programa (las que un ciudadano querría conocer; prioriza medidas con efecto en el día a día sobre declaraciones genéricas). Si el programa no dice nada de un tema, no inventes: deja el tema sin propuestas.

Cada propuesta:
```json
{"id":"<partido>-<tema>-<n>", "tema":"vivienda", "titulo":"máx. 10 palabras, en lenguaje llano",
 "resumen":"1-2 frases claras, sin jerga, qué proponen exactamente",
 "cita":"cita LITERAL del programa, máx. 45 palabras, copiada del .txt", "pagina": 53,
 "concrecion":{"cifra":true,"plazo":false,"financiacion":false,"instrumento":true}}
```
`concrecion`: ¿da una cifra medible? ¿un plazo? ¿dice cómo se paga? ¿nombra el instrumento legal (ley, decreto, reforma concreta)? Juzga solo por el texto del programa.
La cita debe poder encontrarse literalmente en el .txt (se comprobará automáticamente; respeta el texto, puedes unir líneas partidas).

## Contraste (pieza 2)

Elige **7 promesas** emblemáticas del partido entre sus propuestas, de al menos 6 temas distintos; incluye obligatoriamente una de `vivienda`, una de `impuestos` y la que sea su bandera. Para cada una haz el ejercicio completo:

1. **Antecedentes**: ¿prometieron algo igual o parecido antes (programas de 2015, 2016, 2019, 2023, autonómicos, acuerdos de gobierno)? ¿Qué pasó? Si gobiernan o gobernaron (Estado, o comunidades autónomas y grandes ayuntamientos), qué hicieron realmente con ese asunto. Si nunca han gobernado, qué han votado y dicho, y si se han contradicho.
2. **Datos**: qué dicen las cifras oficiales sobre el problema y sobre lo que hicieron.
3. **Viabilidad**: qué necesita la medida (ley ordinaria, ley orgánica, reforma constitucional, competencia autonómica, permiso de la UE, dinero) y qué dicen organismos independientes (AIReF, Banco de España, Tribunal de Cuentas, Consejo de Estado, Comisión Europea, FEDEA, etc.) si se han pronunciado.
4. **Prueba de refutación (obligatoria, en los dos sentidos)**: intenta activamente demostrar que la promesa NO es creíble (incumplimientos, votos contrarios, casos que la contradicen). Y luego intenta lo contrario: demostrar que tu evidencia en contra es falsa, exagerada o está sacada de contexto. Anota qué buscaste y qué encontraste. Si un hecho muy difundido resulta ser falso o engañoso, dilo.
5. **Matices obligatorios**:
   - Votar contra una ley no equivale a estar contra el colectivo o el fin que la ley invoca: recoge el motivo que el partido alegó.
   - Una dimisión, un cese o una medida no es mérito ni demérito sin su cronología: cuándo ocurrió respecto a los hechos que la provocaron.
   - En asuntos judiciales indica SIEMPRE el estado exacto: `investigado`, `procesado`, `juicio`, `condenado_no_firme`, `condenado_firme`, `absuelto`, `archivado`. Nunca presentes una investigación como culpabilidad. Vida privada de personas solo si consta en un procedimiento judicial o documento oficial y es relevante para la promesa.

### Fuentes: regla única

Jerarquía, igual para todos los partidos:
1. **Primarias** (preferidas): BOE, votaciones y diarios de sesiones del Congreso/Senado, INE, Eurostat, Banco de España, AIReF, Ministerios (datos, no notas de autobombo), Tribunal de Cuentas, sentencias y autos (CENDOJ, TC, TS), programas y documentos oficiales de los partidos, hemerotecas con el vídeo o el documento original.
2. **Verificadores e informes independientes**: Newtral, Maldita, EFE Verifica, AFP Factual, FEDEA, Funcas, universidades.
3. **Prensa** de cualquier línea editorial, solo para hechos (no opiniones). Ninguna cabecera es fiable por defecto ni vetada por defecto: El País, RTVE, El Mundo, ABC, El Debate, elDiario.es, OKdiario, El Confidencial, El Español, La Vanguardia… todas con el mismo listón. Para hechos polémicos busca que lo confirmen dos medios de línea editorial distinta o el documento original; si solo lo sostiene uno, márcalo `"fuente_unica": true`.
4. No uses encuestas del CIS para nada salvo que sea imprescindible, y dilo.

**Abre cada URL** (WebFetch) y comprueba que dice lo que afirmas antes de marcar `"verificado": true`. Si no pudiste abrirla (muro de pago, bloqueo), pon `false` y explica en `nota`. No inventes URLs: una URL no comprobada es peor que no tener evidencia.

Cada evidencia:
```json
{"id":"e1", "sentido":"apoya|contradice|contexto",
 "componente":"historial|coherencia|viabilidad|datos",
 "tipo":"votacion|norma|dato_oficial|resolucion_judicial|procedimiento_judicial|documento_partido|declaracion|informe_independiente|verificador|prensa",
 "titulo":"máx. 12 palabras", "hecho":"2-3 frases, solo hechos, con cifras y fechas",
 "fecha":"AAAA-MM-DD o AAAA", "fuente":"nombre del organismo o medio", "url":"https://…",
 "estado_judicial":null, "fuente_unica":false, "verificado":true, "nota":""}
```
`sentido`: `apoya` = hace más creíble que cumplan la promesa; `contradice` = la hace menos creíble; `contexto` = necesario para entender, sin inclinar.
Mínimo 5 evidencias por promesa, con al menos 1 que apoye y 1 que contradiga si existen (si tras buscar no existe ninguna en un sentido, dilo en `refutacion`).

### Puntuación por componentes (tú propones, el editor revisa)

Para cada promesa puntúa de 0 a 4 cada componente, con una frase de justificación que cite ids de evidencias. Usa estos anclajes, idénticos para todos:

- **historial** (qué pasó cuando tuvieron poder para hacerlo): 4 = prometieron lo mismo y lo cumplieron; 3 = lo cumplieron en gran parte; 2 = a medias o resultados mixtos; 1 = prometido y mayormente incumplido; 0 = prometido e incumplido, o hicieron lo contrario. `null` si nunca han tenido poder sobre ese asunto (ni estatal ni autonómico ni municipal relevante).
- **coherencia** (votos, actos y declaraciones frente a la promesa): 4 = todo en la misma dirección durante años; 3 = coherente con alguna excepción menor; 2 = cambios de posición o mensajes cruzados; 1 = contradicciones serias y documentadas; 0 = han hecho o votado sistemáticamente lo contrario.
- **viabilidad** (¿depende de ellos?): 4 = basta un decreto o ley ordinaria, es competencia estatal y cabe en el presupuesto; 3 = ley ordinaria con coste relevante o necesita pactos habituales; 2 = necesita a las comunidades autónomas, ley orgánica o financiación no explicada; 1 = choca con el derecho de la UE, sentencias del TC o exige mayorías muy difíciles; 0 = exige reforma constitucional agravada o es jurídicamente imposible tal como está escrita.
- **datos** (qué dicen las cifras y los organismos independientes sobre que el objetivo sea alcanzable): 4 = respaldo claro; 3 = respaldo parcial; 2 = evidencia mixta o inexistente; 1 = los datos apuntan en contra; 0 = organismos independientes lo consideran inalcanzable o las cifras lo desmienten.

(La `concrecion` ya está en la propuesta; no la puntúes aquí.)

Estructura de cada contraste:
```json
{"propuesta_id":"pp-vivienda-1", "promesa":"la promesa en una frase llana",
 "ha_gobernado":"estatal|autonomico|municipal|nunca", 
 "resumen":"3-4 frases neutrales: qué prometen, qué dice el historial, qué dice la evidencia a favor y en contra",
 "antecedentes":"2-4 frases: promesas iguales o parecidas anteriores y qué fue de ellas",
 "matiz":"1-2 frases con el matiz que evita una lectura injusta (en cualquier dirección)",
 "refutacion":"qué buscaste para tumbar la promesa y para tumbar tu propia evidencia, y qué salió",
 "puntos":{"historial":{"nivel":2,"por":"… (e1,e3)"},"coherencia":{"nivel":3,"por":"…"},"viabilidad":{"nivel":2,"por":"…"},"datos":{"nivel":1,"por":"…"}},
 "evidencias":[ … ]}
```

## Estilo

Español de España, frases cortas, sin jerga, sin adjetivos valorativos. Cifras con su fecha. Nada de emojis.

## Entrega

Escribe UN archivo JSON válido (UTF-8) en `datos/` con el nombre que se te indique. Valídalo con `python3 -c "import json;json.load(open('…'))"` antes de terminar. Tu mensaje final: 10-15 líneas con (a) recuento de propuestas y contrastes, (b) las 3 cosas más relevantes que encontraste, (c) lagunas y evidencias no verificadas, (d) cualquier duda sobre neutralidad que deba revisar el editor.
