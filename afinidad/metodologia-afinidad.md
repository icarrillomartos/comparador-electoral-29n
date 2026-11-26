# Afinidad · Metodología

Comparador 29N. Elecciones generales del 29 de noviembre de 2026. Versión cerrada el 26 de noviembre de 2026.

## Qué es

Un test de 25 preguntas de sí o no que mide cuánto coinciden tus ideas con las posturas de seis partidos: PP, Vox, PSOE, Frente Amplio, Podemos y SALF. No predice el voto ni es un instrumento psicométrico validado.

Las preguntas son generales a propósito: preguntan por el objetivo que le importa al ciudadano, no por el instrumento técnico. Algunas te ponen en la piel de quien sale afectado por una medida, en los dos sentidos, para que respondas pensando en sus consecuencias.

## Cómo se sabe qué opina cada partido

Cada cruce de pregunta y partido (150 en total) tiene una postura de 0 a 4: 0 = claramente no, 2 = mixta, 4 = claramente sí. Cada una lleva su explicación y al menos una fuente con cita literal.

- Primero se usa el programa oficial del 29N. Si no trata el asunto, se usan votaciones, leyes que el partido aprobó o recurrió, lo que hizo donde gobierna y declaraciones de sus dirigentes.
- **Se puntúa por lo que el partido propone y hace, no por si diría «sí» al enunciado.** Por ejemplo, todos dicen querer jueces independientes; puntúa más quien propone que los jueces elijan a su órgano de gobierno y menos quien quiere que lo sigan eligiendo los partidos.
- El silencio no es opinión. Si tras buscar no hay nada fiable, la casilla queda sin postura (8 casillas, todas de SALF).
- Las posturas las revisaron dos verificadores independientes, que abrieron las fuentes y compararon el listón entre partidos.

Archivos: `afinidad/affinity-data.json` (preguntas, posturas, fuentes) y los informes de revisión en `afinidad/revision/`.

## Cómo se calcula tu afinidad

1. En cada pregunta que respondes con sí o no ganas de 0 a 4 puntos con cada partido: si dices sí, los puntos de su postura; si dices no, 4 menos esos puntos.
2. **Coincidencia** = puntos obtenidos / puntos posibles. Solo cuentan las preguntas en las que ese partido tiene postura documentada; no se rellenan huecos.
3. No cuentan para el ranking las preguntas en las que todos los partidos están a un punto o menos (hoy, escuelas de 0 a 3 años y ayudas por hijo), porque suman lo mismo a todos y solo aplastan las diferencias.
4. **Afinidad igualada (0-100).** Los partidos no tienen el mismo número de posturas ni posturas igual de marcadas, y eso haría que unos ganasen más a menudo por azar. Por eso la coincidencia con cada partido se compara con la de todas las formas posibles de responder esas mismas preguntas: la afinidad es la proporción de respuestas posibles que coinciden menos que la tuya (los empates cuentan la mitad). Se calcula de forma exacta. 50 = lo esperable respondiendo al azar.
5. «No lo tengo claro» no puntúa: dudar no es estar en el centro. Edad, género y renta no se preguntan.
6. Si el primero no llega a 80, el resultado dice que ningún partido encaja claramente contigo. Diferencias de 5 puntos o menos se muestran como cercanas.

**Comprobación:** con 20.000 perfiles que responden al azar, la afinidad media es 50 para los seis partidos y cada uno supera 80 en torno al 20 % de las veces. Que un partido salga primero algo más o menos a menudo depende de cuántos partidos tienen posturas parecidas a la suya, que se reparten el primer puesto.

## Tu sitio en el mapa

Dos ejes calculados con las mismas preguntas para ti y para cada partido:

- **Horizontal (progresista ↔ conservador):** velo integral, regularización, sanidad para quien vive en España sin haber contribuido, prisión permanente revisable, eutanasia, matrimonio y adopción entre personas del mismo sexo y violencia de género.
- **Vertical (más Estado ↔ más mercado):** cuota de autónomos, jornada, regulación de las condiciones laborales, ayudas sociales, control del alquiler, impuesto al patrimonio y a las herencias, conciertos educativos, sanidad concertada, pisos turísticos y escuelas infantiles.

Cada sí o no empuja hacia un lado; la posición se divide entre el número de preguntas más uno, de modo que con pocas posturas el punto se acerca al centro. Es una lectura de estas preguntas, no la ideología oficial de nadie. Los bordes no son «extrema izquierda» ni «extrema derecha». El nacionalismo no aparece porque ninguna pregunta trata el modelo territorial.

## Límites

- 25 preguntas no recogen un programa entero.
- Las posturas de 0 a 4 son una lectura razonada de las fuentes, no una medición; cada una enseña su cita para poder discutirla.
- Las respuestas individuales se eliminan al calcular el resultado y no se envían. Opcionalmente, con consentimiento, se comparten sexo, edad, renta y afinidad principal para estadísticas agregadas. Véase [almacenamiento, privacidad y límites](estadisticas.md).
- Las ilustraciones de los candidatos están generadas con inteligencia artificial; no son fotografías.
