# Revisión independiente · PP y Vox (24-11-2026)

Archivos auditados: `datos/pp.json` y `datos/vox.json` (7 contrastes cada uno). No se ha cambiado ningún `nivel`, ninguna `cita` ni `pagina`, ni ningún `id`. Se añadieron dos evidencias (PP, instituciones-2: e7 y e8).

Método: las votaciones se comprobaron descargando los PDF nominales de los datos abiertos del Congreso y contando votos por grupo. El resto de páginas se leyó directamente (texto completo de la página y búsqueda de las cifras y citas). La herramienta de lectura asistida alcanzó su límite de uso a mitad de la revisión; desde entonces todo se leyó por descarga directa.

## 1. Puntos concretos pedidos por el editor

### PP · vivienda · e3 (frase de Feijóo del 16-11-2026) — NO se sostenía; rebajada a contexto y reescrita
- Entrevista original localizada: Politico, «Feijóo: "Haré una auditoría a las cuentas públicas de España. No me creo los datos"» (https://www.politico.eu/article/feijoo-hare-una-auditoria-a-las-cuentas-publicas-de-espana-no-me-creo-los-datos/). Es una entrevista escrita; no hay vídeo ni audio público.
- Intercambio completo: «P. Ha prometido construir un millón de viviendas. ¿Hasta qué punto tiene el Estado que intervenir en el mercado de la vivienda? R. Yo no he dicho que vaya a hacer un millón de viviendas públicas, he dicho que España necesita un millón de viviendas. Y nosotros vamos a impulsar las leyes necesarias para que en España se pueda volver a construir una cifra de 250.000 viviendas al año.» Sigue con tres leyes (ocupación, suelo con licencias en 90 días, propiedad horizontal).
- Nota al pie del propio medio: «CORRECCIONES: En una versión previa de esta entrevista, Feijóo decía: "Yo no he dicho que vaya a hacer un millón de viviendas". La frase literal fue: "Yo no he dicho que vaya a hacer un millón de viviendas públicas"».
- Maldita.es retiró su pieza («[Hemeroteca retirada]») porque «tras esta corrección consideramos que la hemeroteca publicada deja de tener validez».
- Cambios: e3 pasa de `contradice` a `contexto`, con la cita corregida, fuente Politico y `fuente_unica:false`. Se reescriben `resumen`, `matiz`, `refutacion` y la justificación de coherencia, que afirmaban que Feijóo «niega haber prometido construirlas».
- **Nivel que propongo revisar**: coherencia del contraste pp-vivienda-1, de 2 a 3. El 2 se apoyaba en buena parte en esa frase; lo que queda es el rechazo a la Ley del Suelo de 2024 y a los decretos de 2026, con motivo alegado.

### PP · instituciones-2 · cronología judicial (comprobada en notas oficiales del Poder Judicial)
- **Gürtel, primera época**: sentencia de la Audiencia Nacional fechada el 17-5-2018 y notificada el 24-5-2018. Declara al PP «partícipe a título lucrativo» y le obliga a devolver 245.492,80 euros (133.628,48 Majadahonda + 111.864,32 Pozuelo). Menciona una estructura contable paralela «al menos desde 1989». El Tribunal Supremo la confirma el 14-10-2020 (ECLI:ES:TS:2020:3191): **firme**. La nota del Supremo dice que estos partícipes «no son culpables sino responsables civiles» y estima en parte la queja del PP sobre las menciones a la caja B, sin efecto en el fallo. Moción de censura: 1-6-2018.
- **Caja B / papeles de Bárcenas (reforma de la sede)**: sentencia de la Audiencia Nacional de octubre de 2021; el Supremo la confirma en lo sustancial el 15-11-2024 (ECLI:ES:TS:2024:5577): **firme**. Condena penal a dos administradores de la constructora y a Bárcenas (8 meses tras la rebaja por dilaciones). El PP es **responsable civil subsidiario** de la cuota defraudada, parte que no fue recurrida. La nota oficial habla de pagos «de forma opaca, con dinero negro», no usa «caja B». Añadida como e7.
- **Gürtel-Boadilla**: Audiencia Nacional, abril de 2022; PP «responsable a título lucrativo» por 204.198,64 euros. El Supremo confirmó la condena al exalcalde en noviembre de 2023; el PP no recurrió (dato de prensa). Añadida como e8.
- **Kitchen**: juicio visto para sentencia el 28-7-2026. Fiscalía: 15 años para Fernández Díaz. **Sin sentencia a 24-11-2026** (dos búsquedas ese día). El PP no está acusado. `estado_judicial: juicio` se mantiene.
- En ninguna causa hay condena penal al partido. Se reescribieron resumen, antecedentes (ahora en orden cronológico), matiz, refutación y dos justificaciones. El título de e1 decía «el PP se lucró con Gürtel»; ahora «el Supremo confirmó la responsabilidad civil del PP».
- **Aviso al editor**: el esquema solo ofrece `condenado_firme`. En e1, e2, e7 y e8 se refiere a la firmeza de la sentencia; el partido es responsable civil. Recomiendo que la interfaz lo muestre como «responsable civil (sentencia firme)» o añadir ese valor.

### PP · pensiones · votos (fuente primaria: Congreso)
- **2-12-2021**, dictamen de la ley de garantía del poder adquisitivo de las pensiones (sesión 138, votación 83): 176 sí, 148 no, 6 abstenciones. PP: 85 no. Confirmado. e4 enlaza ahora al PDF oficial.
- **27-1-2026**, Real Decreto-ley 16/2025 (sesión 156, votación 1): 171 sí, 178 no. PP 137 no, Vox 33 no. e6 enlaza al PDF oficial.
- **26-2-2026**, convalidación del Real Decreto-ley 3/2026 (sesión 164, votación 23): 317 sí, 33 no. PP 137 sí; los 33 noes son de Vox. e5 enlazaba a la votación de tramitación (349-0); ahora enlaza a la convalidación.
- Corregido en el resumen: decía que en «2025 y 2026» votó contra decretos amplios; solo está comprobado el de enero de 2026.

### Vox · evidencias de fuente única (de 22 quedan 18)
- **Tribunal de Cuentas (instituciones-2, e3) — error serio corregido**. El texto decía que las tres multas «suman alrededor de un millón» y que no se había comprobado si eran firmes. El Tribunal Supremo **anuló la de 862.496 euros** por falta de base probatoria (nota oficial del 5-6-2026, ECLI:ES:TS:2026:2366). Según la memoria del partido citada por Europa Press, anuló también la de 233.324 euros en 2025; esto último no lo pude confirmar con la sentencia. De la de 50.000 euros (julio de 2025) no consta recurso ni firmeza. e3 reescrita con la nota del Supremo como fuente; ajustados antecedentes, matiz y refutación.
- **TSJ de Castilla y León (e7)**: la crónica confirma el contenido (derecho de UGT a 1.237.702 euros de 2023; la Junta paga unos 743.000 tras descontar lo abonado; segunda sentencia tras la de CCOO, que la Junta no recurrió). No da número ni fecha de sentencia ni firmeza, y no encontré la resolución ni un segundo medio. **Sigue como fuente única**. Título cambiado de «condena a la Junta a pagar» a «reconoce a UGT la subvención fijada por ley».
- **Ingresos públicos y Disenso (e1)**: cifras confirmadas en dos medios (12,2 millones públicos en 2025; 18,5 en 2024; 4,1 privados; 2 millones a Disenso, casi 13 en seis años). Los dos beben del mismo desglose de Europa Press, así que no son independientes entre sí. La web de transparencia de Vox devuelve error 403: **cuentas oficiales no abiertas**.
- **TJUE (inmigracion-3, e3)**: nota de prensa 115/24 leída. Sentencia de 29-7-2024, asuntos C-112/22 y C-223/22: no cabe exigir diez años de residencia a residentes de larga duración de terceros países; discriminación indirecta; cinco años bastan. Correcto. `estado_judicial` ya era `null`.
- **«Prioridad nacional» (e4)**: 25-6-2026, sesión 191, votación 13. **168 sí (PP 136, Vox 32), 181 no**, sin abstenciones. Correcto. Añadido el desglose: se votó con la enmienda del PP incorporada y el PP votó a favor. Es una proposición no de ley, sin efecto normativo. La moción anterior de Vox, el 22-4-2026: 33 sí, 310 no.
- Otras que dejan de ser fuente única por el registro del Congreso: inmigracion-2 e6 (12-12-2024: 33 sí, 176 no, 137 abstenciones), territorio e1 (15-9-2020: 52 sí, 196 no, 100 abstenciones) y territorio e2 (20-2-2024: 33 sí, 313 no; el PP votó en contra).

### Votar contra una ley no es estar contra el colectivo
- PP pensiones: e4 incluye el motivo alegado (factor de sostenibilidad) y el matiz lo recoge. PP inmigración e2: la nota aclara que votar la toma en consideración no es apoyar el contenido. PP igualdad: el matiz ya lo decía; se cambió «recortar» por «restringir/modificar».
- Vox igualdad: el matiz y e2 recogen los tres motivos alegados contra el Pacto de Estado. Vox inmigración: el texto no equipara el voto con hostilidad al colectivo. Sin cambios de fondo necesarios.

## 2. Otros cambios
**PP**
- vivienda: «lo fía a» → «lo apoya en»; «desplome» → «caída». e8: Feijóo dijo que no estaba dispuesto a «salvar» al Ejecutivo y que decidiría su voto; el texto lo daba por decidido. e9: añadido el resultado (184 a 166). e1: nota de que el dato de mano de obra no se localizó.
- impuestos e1: el título decía «nueve días después de gobernar»; ahora da la fecha, sin cómputo.
- inmigración e3: añadido que el Supremo rechazó la suspensión cautelar en mayo de 2026.
- instituciones-2 e4: nota de que no consta sentencia del Constitucional.

**Vox**
- inmigracion-2: e5 y e7 enlazan al registro oficial; e3 (reglamento de retornos) suavizada a lo que dice la crónica; «confusión» → «versiones distintas».
- inmigracion-3: resumen precisa qué se votó en abril y qué en junio.
- instituciones-2: resumen y justificación de historial hablan de que el tribunal «reconoció el derecho a cobrar», no de «anular» recortes.
- igualdad: e1 enlaza al registro oficial (315-33); e5 corrige «violencia de género» por «violencia contra la mujer», que es lo que dice el pacto de Aragón; «desmienten» → «no reflejan».
- vivienda: nota y refutación recogen la moción del 24-9-2025 (33 sí, 179 no, 136 abstenciones), sin confirmar que incluyera el IVA cero.
- propuesta vox-pensiones-1: «fía su sostenibilidad a» → «la apoya en».

## 3. Evidencias verificadas abriendo la fuente
**PP**: vivienda e1, e2, e3, e4, e5, e6, e7, e8, e9, e10 (todas conformes salvo e3, reescrita, y el dato de mano de obra de e1). impuestos e3, e7 (conformes). instituciones-1 e3, e6 (conformes; 170-175 con PP 136, Vox 31 y 3 del Mixto). pensiones e4, e5, e6 (Congreso). inmigración e1, e2 (conformes). instituciones-2 e1, e2, e3 más las nuevas e7 y e8. igualdad e1, e6 (conformes).
**Vox**: vivienda e3 (conforme). impuestos e1 (conforme), e5 (conforme). inmigracion-2 e2, e3, e5, e6, e7. inmigracion-3 e3, e4, e8 (parcial: pensión no contributiva confirmada). instituciones-2 e1, e3, e5, e6, e7, e8 (dato de Castilla y León). igualdad e1, e9. territorio e1, e2.

## 4. Evidencias eliminadas
Ninguna.

## 5. Niveles que propongo revisar (no modificados)
- pp-vivienda-1 · coherencia: 2 → 3 (ver arriba).
- vox-instituciones-2 · coherencia (1): se apoya en e1 y e2, que siguen en pie; no propongo cambio, pero el editor debe saber que las multas ya no sirven de apoyo a ese nivel.
- pp-instituciones-2 · historial (2): con tres sentencias en lugar de una cabría un 1; lo dejo a criterio del editor, porque son responsabilidades civiles por hechos de 1999-2008.

## 6. Lo que no pude comprobar
- Registro oficial de la votación de los decretos de vivienda del 2-10-2026: no aparece en los datos abiertos del Congreso para esa fecha ni las cercanas; el resultado (184-166) procede de una crónica.
- Sentencia del Supremo que anula la multa de 233.324 euros a Vox y estado de la de 50.000.
- Sentencias del TSJ de Castilla y León (número, fecha, firmeza).
- Memoria de cuentas de Vox de 2025 (error 403).
- Importe exacto que la Audiencia Nacional fijó al PP en la causa de la sede (123.669 euros, solo prensa) y si el PP recurrió Boadilla.
- Si el Constitucional ha resuelto los recursos del PP contra la Ley Trans y contra la reforma de la malversación: las búsquedas no dan sentencia.
- No revisé por falta de margen: PP impuestos e5, e6, e8; PP igualdad e2, e4; PP inmigración e4, e5; Vox vivienda e1, e2, e4 (solo parcial), e7, e8; Vox impuestos e2, e3, e6; Vox inmigracion-2 e1, e8, e9, e10; Vox inmigracion-3 e1, e5, e6, e7, e9; Vox instituciones-2 e2, e4; Vox igualdad e2 a e8; Vox territorio e3 a e5. Tampoco los resúmenes de las 97 propuestas, salvo una búsqueda automática de términos valorativos.
