# Estadísticas de participación 29N

Desde el 26 de noviembre de 2026, al terminar el cuestionario se calcula el resultado y se eliminan inmediatamente las 25 respuestas individuales. No se envían al servidor ni se guardan en el almacenamiento del navegador.

Compartir es opcional. Con consentimiento explícito de una persona mayor de 18 años, se envían sexo, tramo de edad, tramo de renta personal neta mensual y afinidad principal. Cada categoría permite «Prefiero no responder». Se puede ver el resultado sin compartir.

La afinidad principal es el partido mejor situado entre los que tienen cobertura suficiente; si la diferencia entre los dos mejores es de 5 puntos o menos, se cuenta «Sin diferencia clara». Con menos de 12 respuestas o sin cobertura suficiente se cuenta «Sin base suficiente». No se guardan las puntuaciones de los seis partidos.

## Almacenamiento y publicación

MySQL conserva contadores separados por dimensión, categoría y afinidad. Una transacción incrementa los tres contadores o ninguno. No se crea una fila por persona ni un perfil combinado. Los agregados no caducan y no permiten localizar y retirar una aportación individual.

El navegador conserva en sessionStorage solo un identificador aleatorio y una marca de envío. El servidor conserva el hash de ese identificador durante 30 días, más el tiempo hasta la siguiente limpieza, para evitar duplicar reintentos durante ese plazo. No está vinculado a los contadores. No guardamos IP, nombre, correo ni respuestas en estas tablas. El alojamiento puede mantener sus propios registros técnicos.

GET /api/afinidad/estadisticas devuelve los agregados, sin caché. El frontal los consulta al mostrar resultados y cada 30 segundos mientras esa pantalla está visible. POST admite únicamente las cuatro categorías, versión, identificador aleatorio y consentimiento; rechaza campos extra, incluidas respuestas. El control de frecuencia es temporal y en memoria.

Los recuentos exactos son públicos: comparar consultas sucesivas cuando entra una sola aportación puede permitir inferir las categorías que se han sumado. Separar los contadores no garantiza anonimato frente a esa comparación temporal.

## Interpretación y límites

Es una muestra voluntaria de quienes comparten, no una encuesta representativa ni intención de voto. Más participaciones amplían la muestra, pero no eliminan el sesgo de selección. Se avisa si hay menos de 30 participaciones. El control básico de duplicados no demuestra que cada envío corresponda a una persona única; abrir otra sesión o manipular el cliente puede generar otro envío. El servidor valida categorías, pero no puede comprobar una afinidad sin recibir las respuestas, que deliberadamente no se transmiten.

No hay datos simulados en producción. Las pruebas de concurrencia, reintentos, rollback y privacidad usan una base local aislada. La versión de agregados es `29n-2026-v1`.
