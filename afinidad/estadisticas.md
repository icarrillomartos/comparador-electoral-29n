# Estadísticas de participación 29N

Desde el 26 de noviembre de 2026, al terminar el cuestionario se calcula el resultado y se elimina inmediatamente el conjunto completo de las 25 respuestas. Para la tarjeta descargable solo se conserva en memoria de la pestaña un resumen de hasta seis respuestas (tres coincidencias y tres diferencias), que desaparece al reiniciar o salir. No se envían al servidor ni se guardan en el almacenamiento del navegador.

Compartir es opcional. Con consentimiento explícito de una persona mayor de 18 años, se envían sexo, tramo de edad, tramo de renta personal neta mensual y los tres primeros partidos con sus puntuaciones de afinidad (0–100), además de la clasificación principal compatible con el histórico. Cada categoría permite «Prefiero no responder». Se puede ver el resultado sin compartir.

La afinidad principal es el partido mejor situado entre los que tienen cobertura suficiente; si la diferencia entre los dos mejores es de 5 puntos o menos, se cuenta «Sin diferencia clara». Con menos de 12 respuestas o sin cobertura suficiente se cuenta «Sin base suficiente». Desde el 27 de noviembre se guardan las tres primeras puntuaciones; no se guardan las otras tres. Si no hay base suficiente, las tres puntuaciones se envían como null y no cuentan como afinidad con un partido. Los registros anteriores no contienen el top 3 y no se rellenan por inferencia.

## Almacenamiento y publicación

Desde la corrección del 27 de noviembre, MySQL conserva una fila por participación en `affinity_29n_participations`: identificador aleatorio independiente, versión, sexo, tramo de edad, tramo de renta, clasificación principal y top 3 con puntuaciones. No almacena las respuestas, IP, nombre, correo ni identificadores del navegador en esa fila. El recibo, la fila conjunta y los contadores se confirman en una única transacción, o se revierten todos. Los registros y agregados se conservan.

El consentimiento actualizado explica el almacenamiento conjunto. El nuevo cliente envía `jointConsent: true`; los clientes antiguos sin ese campo siguen alimentando únicamente los contadores que aceptaron. No se reimportan reintentos de recibos existentes.

El navegador conserva en sessionStorage solo un identificador aleatorio y una marca de envío. El servidor conserva el hash de ese identificador durante 30 días, más el tiempo hasta la siguiente limpieza, para evitar duplicar reintentos durante ese plazo. No está vinculado a los contadores. No guardamos IP, nombre, correo ni respuestas en estas tablas. El alojamiento puede mantener sus propios registros técnicos.

GET /api/afinidad/estadisticas devuelve los agregados, sin caché. El frontal los consulta al mostrar resultados y cada 30 segundos mientras esa pantalla está visible. POST admite las cuatro categorías, versión, identificador aleatorio, consentimiento, jointConsent opcional y top3 (tres pares party/score únicos, ordenados, con puntuaciones válidas). Se aceptan clientes antiguos sin top3 sin convertirlos en registros completos; rechaza campos extra, incluidas respuestas. El control de frecuencia es temporal y en memoria.

Los recuentos exactos son públicos: comparar consultas sucesivas cuando entra una sola aportación puede permitir inferir las categorías que se han sumado. Separar los contadores no garantiza anonimato frente a esa comparación temporal. Dentro del servidor, una combinación de tres puntuaciones poco frecuente también puede correlacionar tramos entre dimensiones; no se presenta esta separación como anonimato garantizado. La API pública no expone esa combinación completa.

## Interpretación y límites

Es una muestra voluntaria de quienes comparten, no una encuesta representativa ni intención de voto. Más participaciones amplían la muestra, pero no eliminan el sesgo de selección. Se avisa si hay menos de 30 participaciones. El control básico de duplicados no demuestra que cada envío corresponda a una persona única; abrir otra sesión o manipular el cliente puede generar otro envío. El servidor valida categorías, pero no puede comprobar una afinidad sin recibir las respuestas, que deliberadamente no se transmiten.

No hay datos simulados en producción. Las pruebas de concurrencia, reintentos, rollback y privacidad usan una base local aislada. La versión de agregados es `29n-2026-v1`.


## Tarjeta para redes

«Descargar mi afinidad» prepara localmente un PNG de 1080 × 1920 con las tres primeras afinidades, el mapa de dos ejes y hasta tres coincidencias y tres diferencias claras con el primer partido elegible. En caso de empate lo indica; si faltan casos claros no inventa otros. La vista previa permite revisar las respuestas seleccionadas antes de descargar o abrir el menú nativo de compartir. No incluye sexo, edad ni renta. No envía las preguntas ni la imagen a un servicio y no cambia el contenido de las estadísticas.

## Cobertura del top 3 y recuperación

La API pública expone para cada puesto los recuentos por partido y la suma/número de puntuaciones, no las combinaciones completas almacenadas. Las vistas «1.ª», «2.ª» y «3.ª afinidad» utilizan como denominador solo los envíos que incluyen top 3. «Principal · histórico» mantiene todos los registros. Se muestra cuántos incluyen información completa. Empates de puntuación no implican un ganador único; el orden replica el resultado del cuestionario.

No se cambia la versión del identificador de aportación, evitando recontar la misma sesión al actualizar. Un recibo ya aceptado no se amplía retroactivamente con un top 3 de otra respuesta. Una visita con una versión antigua todavía abierta puede seguir enviando el formato anterior.

El sistema anterior nunca envió puntuaciones en el POST. Sus contadores y recibos no permiten recuperarlas. El código solo persistía un identificador aleatorio y una marca de envío en sessionStorage; cookies, localStorage e IndexedDB no guardaban afinidades. Una pestaña todavía abierta o una imagen descargada puede conservar un resultado individual, pero no demuestra a qué registro agregado corresponde y no se reimporta automáticamente. No se accede a navegadores de otros visitantes.


## Cruce edad–renta y recuperación cierta

La respuesta pública incluye `cross`: recuentos por edad, renta, primer partido y procedencia (`direct` o `recovered`), además de cobertura. No devuelve sexo y top 3 de cada fila privada. El primer puesto no significa necesariamente un ganador claro.

Para los históricos que sí guardaron top 3, el servidor agrupa por firma exacta de tres partidos y puntuaciones. Resta primero todas las filas conjuntas de los contadores, dentro de una instantánea consistente, para no contarlas dos veces. Para cada firma, una celda edad–renta tiene al menos `max(0, n_edad + n_renta − n_total)` aportaciones en cualquier tabla conjunta compatible. Solo publica ese mínimo garantizado. No empareja arbitrariamente los casos restantes ni atribuye un sexo individual a los cruces recuperados. Los totales de las tres dimensiones deben coincidir; datos corruptos impiden la recuperación. Se excluyen del mapa los tramos no declarados y puntuaciones nulas.

Las pruebas locales cubren 625 tablas históricas, 625 casos mixtos, casos ambiguos, reintentos concurrentes, rollback y conservación conjunta efectiva. No se crean registros de prueba en producción.
