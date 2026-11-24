# Comparador 29N · Metodología

Versión de Claude, cerrada el {{FECHA}}. Elecciones generales del 29 de noviembre de 2026.

## Qué contiene

{{RECUENTO}}

Cuatro espacios:

1. **Comparar**: propuestas de cada partido por tema, con cita literal y página del programa oficial.
2. **Contraste**: promesas concretas enfrentadas a hechos documentados, con un índice de plausibilidad.
3. **Balance 2018**: compromisos de Pedro Sánchez desde la moción de censura de 2018, su resultado, el dato actual y lo que promete ahora el PSOE.
4. **España en datos** (dentro de «Desde 2018»): indicadores oficiales en 2018 y en su último dato publicado, con el cambio en porcentaje.

Los temas son catorce. «Corrupción» es un bloque propio, separado de «Instituciones y justicia»: recoge delitos de corrupción y sus penas, agencias anticorrupción, protección de denunciantes, contratación pública, financiación de partidos, puertas giratorias, conflictos de interés, lobbies y transparencia. Tres programas (PNV, EH Bildu y Coalición Canaria) no recogen medidas concretas sobre corrupción.

## Documentos de partida

Programas oficiales descargados entre el 23 y el 24 de noviembre de 2026. La huella SHA-256 permite comprobar que el archivo no ha cambiado.

{{PROGRAMAS}}

Los programas de PSOE, SALF y Vox se obtuvieron de la copia de Internet Archive de la URL oficial, porque las webs de esos partidos bloquean la descarga automática. El de Junts lo localizó la investigación en la web de campaña del partido.

## Cómo se extraen las propuestas

- De cada programa se toman, por tema, las 2-4 medidas más concretas y con más efecto en el día a día.
- Cada propuesta lleva una **cita literal**. Un programa comprueba que la cita aparece en el texto del PDF y fija la página. Las que no se encuentran aparecen en el informe de incidencias y se corrigen o se retiran.
- El título y el resumen son redacción propia, en lenguaje llano. La cita es del partido.
- **Concreción**: se anota si el texto da cifra medible, plazo, forma de pago e instrumento legal.

### El programa completo (segundo nivel)

{{CODEX_PROPUESTAS}}

## Cómo se hace el contraste

Para cada promesa contrastada (catorce por partido nacional: siete de la primera selección, de al menos seis temas y siempre con vivienda, impuestos y su bandera, y siete de la ampliación del 24 de noviembre):

1. **Antecedentes**: promesas iguales o parecidas en programas y acuerdos anteriores, y qué fue de ellas.
2. **Historial de gobierno**: qué hicieron donde tuvieron poder (Estado, comunidades autónomas, grandes ayuntamientos). Si nunca gobernaron: votos, actos y declaraciones.
3. **Datos**: cifras oficiales sobre el problema y sobre los resultados.
4. **Viabilidad**: qué exige la medida (decreto, ley ordinaria u orgánica, reforma constitucional, competencias autonómicas, derecho de la UE, dinero) y qué han dicho organismos independientes.
5. **Prueba de refutación en los dos sentidos**: primero se busca activamente lo que desmiente la promesa; después se intenta desmentir esa evidencia en contra. Queda escrito qué se buscó y qué salió.

### Regla única de fuentes

El mismo listón para todos los partidos y todos los medios:

1. Documentos primarios: BOE, votaciones y diarios de sesiones, INE, Eurostat, Banco de España, AIReF, Tribunal de Cuentas, resoluciones judiciales, documentos de los partidos.
2. Verificadores e informes independientes.
3. Prensa de cualquier línea editorial, solo para hechos. Ninguna cabecera es fiable ni está vetada por defecto. Un hecho sostenido por un solo medio se marca «Una sola fuente».
4. Cada enlace se abre y se comprueba. Si no se pudo, se marca «Enlace sin verificar».

### Salvaguardas de neutralidad

- Sin adjetivos sobre personas o partidos. Se describen hechos; el juicio es del lector.
- En asuntos judiciales, siempre el estado exacto (investigado, procesado, en juicio, condena no firme, condena firme, absuelto, archivado).
- Votar contra una ley no se presenta como estar contra el fin que la ley invoca: se recoge el motivo alegado.
- Dimisiones y ceses se presentan con su cronología respecto a los hechos.
- Mismo número de promesas contrastadas por partido y mismos criterios de puntuación.

## El índice de plausibilidad

Pregunta que responde: **si este partido gobernara con capacidad para aplicarlo, ¿qué respaldo tiene la idea de que cumpla esta promesa?**

No es una probabilidad estadística ni una predicción calibrada. Es un resumen ordenado y reproducible de la evidencia.

### Componentes

| Componente | Peso | Niveles (0 a 4) |
|---|---|---|
| Historial | 30 | 4 = prometieron lo mismo y lo cumplieron · 3 = en gran parte · 2 = a medias · 1 = mayormente incumplido · 0 = incumplido o hicieron lo contrario · sin nivel si nunca tuvieron poder sobre el asunto |
| Viabilidad | 25 | 4 = basta decreto o ley ordinaria, competencia estatal, cabe en presupuesto · 3 = ley ordinaria con coste o pactos habituales · 2 = necesita a las comunidades, ley orgánica o financiación no explicada · 1 = choca con la UE o el TC, o mayorías muy difíciles · 0 = reforma constitucional agravada o inviable jurídicamente |
| Coherencia | 20 | 4 = todo en la misma dirección durante años · 3 = alguna excepción menor · 2 = cambios de posición · 1 = contradicciones serias · 0 = sistemáticamente lo contrario |
| Datos | 15 | 4 = respaldo claro de cifras y organismos independientes · 3 = parcial · 2 = mixto o inexistente · 1 = apuntan en contra · 0 = lo consideran inalcanzable |
| Concreción | 10 | Un punto por cada elemento presente en el programa: cifra, plazo, financiación, instrumento legal |

### Cálculo

1. Cada nivel se convierte a escala 0-100 (nivel × 25).
2. Índice base = media ponderada de los cinco componentes. Si no hay historial (el partido nunca tuvo poder sobre el asunto), ese componente cuenta como neutro: 50 sobre 100.
3. Topes: viabilidad 0 → máximo 20; viabilidad 1 → máximo 45; historial 0 → máximo 50.
4. Margen de incertidumbre: ±6 de base; +6 sin historial; +4 con menos de cuatro evidencias verificadas; +2 si alguna evidencia está sin verificar o es de fuente única; +2 si hay al menos dos evidencias a favor y dos en contra.
5. El resultado se redondea al entero más próximo (los ,5 hacia arriba).
6. Escala: ≥75 muy plausible · 60-74 plausible · 45-59 dudosa · 25-44 poco plausible · <25 muy poco plausible.

El código exacto está en `build.py` (función `indice`). `datos.json` contiene los niveles, la justificación de cada uno y el resultado, de modo que cualquiera puede recalcularlo.

### Por qué estos pesos

- El **historial** pesa más porque es lo único que ya ha ocurrido: lo que un partido hizo con poder predice mejor que lo que dice.
- La **viabilidad** va segunda porque una promesa que no depende de quien la hace no puede cumplirse por mucha voluntad que haya; de ahí también los topes.
- **Coherencia** y **datos** matizan. La **concreción** pesa poco: es fácil escribir cifras, pero su ausencia total es informativa.
- No haber gobernado no suma ni resta: solo aumenta la incertidumbre.

## España en datos

{{ESPANA}}

- El punto de partida es el dato de 2018 (anual, o el del segundo trimestre o junio si la serie es trimestral o mensual) y el punto de llegada es el último publicado a la fecha de cierre. Los dos valores salen de la misma serie; cuando hubo ruptura metodológica se usa la serie homogénea o se avisa en la nota del indicador.
- El cambio en porcentaje es (valor actual − valor de 2018) / valor de 2018. En las tasas se da además la diferencia en puntos.
- «Mejor» o «Peor» se asigna solo cuando la dirección deseable no es discutible (menos paro, menos pobreza, más renovables). Donde valorar la dirección es una opinión (presión fiscal, población, llegadas irregulares, precio de la vivienda, natalidad) se marca «Sin valorar».
- Los importes en euros son nominales. Hay que compararlos con la subida de precios del mismo periodo, que figura como indicador.
- Que un dato cambie mientras un gobierno está en el poder no prueba que cambie por su acción: en el periodo hubo una pandemia y una crisis de precios, y sanidad, educación y buena parte de la vivienda son competencia autonómica.

### Lo que hay detrás del titular

{{FONDO}}

Cada análisis parte de una afirmación habitual en el debate público y la somete a la lectura de un economista escéptico, en los dos sentidos: el dato que se suele citar, el dato que lo corrige (por persona, por hora, en términos reales, por 100.000 habitantes del mismo grupo) y las cautelas que matizan esa corrección. Reglas:

- **Las hipótesis se comprueban, no se dan por buenas.** Cuando el dato confirma una sospecha se dice con la cifra; cuando la desmiente o la matiza, también.
- **Cálculos propios.** Tasas por 100.000 habitantes, deflactados por el IPC y descomposiciones simples se hacen con dos datos oficiales del mismo grupo y del mismo año, y se marcan «Cálculo propio con datos oficiales».
- **Nacionalidad y país de nacimiento son cosas distintas** y se etiquetan como las publica la fuente. Las estadísticas policiales, judiciales y penitenciarias españolas solo registran nacionalidad; quien se nacionaliza cuenta como español. Solo la violencia de género registra país de nacimiento. Ninguna estadística oficial registra el origen de los padres.
- **Detenido o investigado no es condenado**, y una tasa bruta por nacionalidad no ajusta por edad ni sexo, incluye a no residentes en el numerador y cuenta detenciones, no personas. Los «hechos esclarecidos» no se publican por nacionalidad del autor.
- **Ningún dato atribuye conducta a un grupo**: describe un cociente con un denominador imperfecto.
- **Lo que no se puede saber** con los datos publicados se dice en cada análisis.

## Auditoría del 24 de noviembre de 2026

Después de la primera entrega, ocho auditores independientes (otro modelo de IA, sin acceso a las conclusiones del autor) revisaron los 42 contrastes y el balance abriendo los enlaces, y un noveno comprobó que los niveles se asignaron con el mismo listón a los seis partidos. Resultado:

{{AUDITORIA}}

Solo se aplicaron los hallazgos que el auditor respaldó con una fuente que abrió. Los cambios de nivel los decidió el editor y figuran, con su motivo, en «Ajustes editoriales de nivel». La auditoría de equidad no encontró un sesgo sistemático a favor o en contra de ningún partido.

## Lo incorporado de la edición Codex

El 24 de noviembre de 2026 el usuario pidió aprovechar lo que aportara una segunda edición independiente de este comparador, elaborada por otro asistente (Codex), sin bajar el listón de esta. Se hizo así:

{{CODEX}}

Lo que **no** se ha traído: las valoraciones y conclusiones de Codex (su método mide concreción, competencia, financiación y ejecución, y no es comparable con este índice), los expedientes de partidos territoriales y los programas de PACMA y UPN, que esta edición no cubre.

## Límites

- Los niveles son juicios razonados, no mediciones. Se muestran con su justificación para que puedan discutirse.
- El índice no valora si una medida es buena o mala.
- No incorpora la aritmética parlamentaria que resulte de las urnas.
- La selección de promesas es una muestra, no un censo. Un partido puede salir mejor o peor según qué promesas se elijan.
- Los partidos que han gobernado tienen más historial, a favor y en contra, que los que no. La comparación directa de porcentajes entre unos y otros debe hacerse con esa cautela.
{{PROFUNDIDAD}}
- **El historial neutro tiene un efecto.** Un partido sin historial cuenta 50 en ese componente; los que han gobernado suelen quedar por debajo de 50 en las promesas elegidas. Por eso la media de un partido que no ha gobernado puede salir algo más alta sin que eso signifique que sea más fiable: significa que hay menos con qué medirlo, y su margen de incertidumbre es mayor.
- «Evidencia verificada» significa que el investigador o el revisor abrió la URL citada y comprobó que dice lo afirmado. En algunos casos la URL es un medio que cita un documento oficial que no pudo abrirse; se indica en la nota de la evidencia.
- La investigación la hicieron asistentes de IA con verificación de enlaces y revisión editorial posterior; puede haber errores. Cada dato enlaza a su fuente para que se pueda comprobar.

{{INCIDENCIAS}}
