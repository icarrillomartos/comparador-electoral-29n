# Revisión independiente · PSOE y Podemos (24-11-2026)

Archivos auditados: `datos/psoe.json` y `datos/podemos.json` (7 contrastes cada uno). No se ha tocado ningún `nivel`, ni `propuestas[].cita`/`pagina`, ni los `propuesta_id`. Los dos JSON validan con `json.load`. Las evidencias quedan numeradas de forma correlativa (e1…eN) en cada contraste y todas las referencias de `resumen`, `antecedentes`, `matiz`, `refutacion`, `por`, `hecho` y `nota` se han renumerado y comprobado por script (ninguna apunta a una evidencia eliminada).

Recuento: PSOE pasa de 65 a 64 evidencias; Podemos, de 112 a 84 (12 por contraste). Ninguna URL con espacios, vacía o de Wikipedia.

## 1. Puntos concretos del encargo

### PSOE
- **`psoe-impuestos-1` e2 (Hacienda, «sin URL»)**: la URL existía pero llevaba espacios sin codificar. Corregida con `%20`; el PDF oficial abre y la diapositiva 5 confirma 27%, 28%, 17.814 contribuyentes y «aumento de 204 millones en 2024».
- **Estados judiciales (comprobados el 24-11-2026)**:
  - **José Luis Ábalos**: sentencia del Supremo notificada el 22-6-2026 (ECLI:ES:TS:2026:2553), por unanimidad. 24 años y 3 meses por organización criminal, cohecho, malversación y tráfico de influencias. **Firme**: única instancia; incidente de nulidad desestimado por unanimidad el 14-10-2026; recurso de amparo ante el Constitucional presentado (noticia del 5-11-2026), pendiente de admisión, no suspende la condena. En prisión desde noviembre de 2025. `condenado_firme` se mantiene; hecho y nota reescritos.
  - **Koldo García**: 19 años, 8 meses y un día (el texto decía «19 años y 8 meses»), mismos cuatro delitos; firme en los mismos términos.
  - **Víctor de Aldama**: 4 años y 6 meses por organización criminal y cohecho, ejecución suspendida.
  - **Santos Cerdán**: `investigado`. Dos causas en la Audiencia Nacional: obra pública (remitida por el Supremo el 2-2-2026) y, desde mayo de 2026, la de la presunta trama para obstaculizar investigaciones (caso Leire Díez), que el archivo no recogía. Sin procesamiento, juicio ni sentencia localizados; últimas diligencias halladas, de julio de 2026.
  - **David Sánchez**: `condenado_no_firme`. Audiencia de Badajoz, 14-7-2026 (ECLI:ES:APBA:2026:795): 9 años de inhabilitación como cooperador necesario de prevaricación administrativa; absuelto de tráfico de influencias; recurrida en apelación ante el TSJ de Extremadura (recursos de octubre de 2026). Fuente sustituida por la nota oficial del Poder Judicial.
  - **Begoña Gómez** (solo citada en el `matiz`): irá a juicio con jurado, sin fecha de vista ni sentencia. He simplificado la frase y quitado lo que no pude comprobar (la fecha de 21-9-2026 y la posición de la Fiscalía siguen citadas en `refutacion` con su fuente, Ara).
  - **Francisco Salazar**: sin procedimiento judicial; `estado_judicial: null`. Querella de Hazte Oír inadmitida en enero de 2026; denuncia de Manos Limpias ante la Fiscalía (5-12-2025) sin resultado localizado; no consta denuncia de las afectadas.
- **Igualdad, caso Ábalos**: **evidencia eliminada** (antigua e8). La nota oficial del Supremo solo dice «la contratación de dos conocidas del exministro en empresas públicas» y «el pago del piso a una de ellas»; la condena es por corrupción y no trata de violencia machista ni de protección de víctimas. Vínculo indirecto: se retira de igualdad y se explica en `refutacion`; sigue en instituciones.
- **Igualdad, pulseras** (e3): precisado qué falló (tras el cambio de adjudicataria no se podían obtener datos anteriores al 20-3-2024), cuándo (2024; contrato adjudicado el 11-10-2023), efecto (sobreseimientos provisionales y absoluciones en causas por quebrantamiento, reabiertos después según la Fiscalía) y **que no existe cifra oficial de casos**: ni Fiscalía ni CGPJ la han dado; la ministra habló de «menos del 1%» y después dijo desconocer el número. Qué se hizo (e4): multa a la adjudicataria y nueva adjudicación en 2026 con pliego más exigente; e4 pasa a `contexto`.
- **Igualdad, caso Salazar** (e7): hechos y fechas ordenados, nota depurada (repetía tres veces lo mismo) y sin casos de terceros. Pasa de `contradice` a `contexto` (ver punto 3).
- **Instituciones, David Sánchez** (e7): pasa a `contexto`, con título centrado en la institución («Condena no firme por una contratación en la Diputación de Badajoz»). El texto dice expresamente que es una administración provincial, no el Gobierno, y que la relación con la promesa es indirecta. `por` de coherencia, `matiz`, `resumen` y `refutacion` ajustados.
- **«Solo sí es sí»** (e5): fuente sustituida por la nota del CGPJ. Cifras con fecha: al menos 1.233 rebajas y 126 excarcelaciones (nota de 24-11-2023, datos a 1-11-2023; no hay recuento posterior). Supremo: confirmó en junio de 2023 el criterio de las audiencias (norma más favorable). Reforma: LO 4/2023, aprobada el 20-4-2023 por 233-59-4. Eliminado «tuvo que corregirse». El `resumen` decía 1.205; ahora 1.233.

### Podemos
- **Máximo de 12 evidencias por contraste**: hecho (14/14/14/21/17/12/20 → 12 en todos). Detalle en el punto 4.
- **`anexo_casos_internos` eliminado** (6 fichas: Neurona, caja de solidaridad, «niñera», sobresueldos, Dina, Tribunal de Cuentas).
- **Acuerdo de coalición de 2019 (2 URL inválidas)**: sustituidas por la copia íntegra difundida por El País (`d500.epimg.net/...pdf`), que abre y cuyo texto se comprobó (punto 1.4 del SMI literal; cero menciones a monarquía, Corona, república, inviolabilidad, OTAN, Rey o «empresa pública de energía»; única reforma constitucional, el 2.11.7 sobre aforamientos). La copia oficial de psoe.es existe pero bloquea el acceso automático; se indica en la nota.
- **Wikipedia** (instituciones e9): sustituida por el resumen de resultados de la Junta Electoral Central (BOE-A-2023-18907): PP 137, Vox 33, PSOE 102 + PSC 19.
- **Monedero**: eliminadas las dos evidencias sobre el expediente de la Complutense y el archivo penal de esos hechos (ámbito universitario, sin relación directa con la promesa; criterio del punto 2). Se conserva una sola evidencia, como `contexto`, sobre cómo gestionó el partido las quejas internas (12-9-2023; sin expediente formal; publicado el 20-2-2025), con `archivado` referido a las diligencias de la Fiscalía de mayo de 2025 y la aclaración de que no hay procedimiento judicial.
- **«Solo sí es sí»**: mismas cifras y fechas que en el PSOE; evidencia del Supremo sustituida por la nota oficial (29 recursos, 27 resueltos por unanimidad; el texto decía «27 desestimados»). Eliminada la declaración de la ministra sobre los jueces y la frase «Montero culpó a los jueces»; `resumen`, `matiz`, `refutacion` y `por` reescritos sin atribuir intención.

## 2. Evidencias verificadas abriendo la URL

OK sin cambios: PSOE vivienda e1, e10; impuestos e5; empleo e2, e4, e8; sanidad e1, e3, e4, e5; seguridad e1; instituciones e5 (nota del Supremo). Podemos vivienda e2 (antigua), e5 (+PDF de FEDEA), e10; impuestos e2, e6, e12; empleo e6, e7; igualdad e2, e7, e9, e19 (antiguas); energía e6, e8; instituciones e1, e11; exterior e4, e6, e17.

Con corrección:
- PSOE vivienda e2: URL corta → URL definitiva; los tres componentes suman 105.000, no 110.000 (anotado).
- PSOE vivienda e6: la fuente es la Declaración sobre la Cuenta General de 2024; original no localizado.
- PSOE impuestos e4: faltaba 1 abstención en el RDL 9/2024.
- PSOE impuestos e9: el artículo de Demócrata **no** dice que el 35% carezca de estimación; el hecho se apoya ahora en el texto del programa y deja de ser `fuente_unica`.
- PSOE empleo e6: el artículo no califica el dictamen del Consejo de Estado; actualizado a 19-11-2026 (sigue sin aprobar).
- PSOE sanidad e8: añadido el resultado del Consejo Interterritorial del 23-10-2026 (voto en contra de las comunidades del PP); pasa a `contexto`.
- PSOE seguridad e2: la crónica es previa a la votación; e5: URL definitiva y la frase de fuentes anónimas sale del hecho; e6: el +17% es del importe, no del número de sanciones; e8: fecha confirmada (6-9-2025).
- Podemos vivienda e4: el 4,9% es de las zonas tensionadas de Cataluña; e11 (antigua e12): no hubo votación, era un borrador; pasa a `contexto`.
- Podemos impuestos e9: sustituida por la nota original del Banco de España; los 14.785 millones incluyen los 5.225 ya recuperados.
- Podemos empleo e11: localizado el estudio de la AIReF («negativo, pero moderado»); las cifras siguen procediendo del medio.
- Podemos energía e3: Junts se abstuvo; e5 (antigua e7): la noticia del veto es anterior al registro del texto del BOCG.
- Podemos instituciones e5: el voto en comisión fue a finales de noviembre de 2020.
- Podemos exterior e9 (antigua e12): Sumar y CC se abstuvieron solo en el punto del referéndum.

## 3. Reclasificaciones y criterio aplicado

Mismo criterio para los dos partidos: la gestión interna de denuncias de acoso (Salazar en el PSOE, Monedero en Podemos) se refiere al funcionamiento del partido, no a la política pública prometida; ambas quedan como `contexto`, con una sola evidencia por partido. Otras: PSOE igualdad e4, instituciones e7 y sanidad e8 → `contexto`; Podemos vivienda (borrador de decreto) y empleo (ley de 37,5 horas) → `contexto`.

## 4. Evidencias eliminadas (ids originales)

- PSOE igualdad: e8 (Ábalos).
- Podemos vivienda: e3 (IPVA del INE), e13 (firma retirada en 2021).
- Podemos impuestos: e13 (beneficio de la banca; el dato pasa a la nota de e2), e14 (debate de 2026 sin resultado, fuente única).
- Podemos empleo: e13 (35 horas), e14 (ingreso mínimo vital): no hablan del salario mínimo.
- Podemos igualdad: e3 (aviso del CGPJ; resumido en la nota de e2), e4 (31,4%; pasa a la nota de e2), e6 (declaración de Montero), e10 (fundida en e9), e12 (fundida en e13, ahora con el BOE de la LO 1/2025), e16 (estadística de Interior), e17 (voto deducido, no comprobado), e20 y e21 (Monedero).
- Podemos energía: e4 (Ribera), e5 (tope al gas, medida vecina), e9 (beneficios de Repsol), e13 (EDF), e17 (mitin).
- Podemos exterior: e3 (acuerdo de coalición; pasa a la nota de e2), e5 (fundida en e6), e8 (armas a Ucrania), e14 (fundida en e13), e16, e18, e19, e20.

## 5. Niveles que propongo revisar (no modificados)

- **Podemos exterior, viabilidad (1 → 3)**: el `por` se basa en que hay una mayoría contraria; la regla dice que la viabilidad mide el obstáculo jurídico, y aquí basta la autorización de las Cortes y un año de preaviso.
- **Podemos impuestos, viabilidad (1 → 2)**: se apoya sobre todo en votaciones perdidas; el obstáculo jurídico real (no confiscatoriedad, instrumento para el rescate) está sin resolver, lo que encaja mejor en 2.
- **Podemos empleo, viabilidad (3 → 3 o 4)**: la cuantía es un real decreto; el 3 solo se justifica por el suelo legal del 75%.
- **PSOE igualdad, coherencia (2)**: tras retirar a Ábalos y pasar a contexto las denuncias internas, la única base del 2 es la reforma de la ley de 2022 y la ley abolicionista sin aprobar; el editor puede valorar un 3. El `por` ya no sugiere bajar a 1.
- **PSOE instituciones, coherencia (1)**: se sostiene con e5 (condena firme) y e6 (investigación), sin apoyarse ya en la condena de Badajoz.

## 6. Lo que no pude comprobar

- Texto íntegro de la sentencia del Supremo (solo la nota oficial y prensa): los detalles de las contrataciones no se han incluido por eso.
- Situación de Santos Cerdán en octubre-noviembre de 2026: no encontré novedades posteriores a julio; no hay constancia de procesamiento.
- Si la Fiscalía pidió la absolución en el caso de Badajoz (solo prensa) y la fecha exacta de los recursos.
- La página de Maldita sobre las pulseras es demasiado larga para la herramienta; contrastada con extractos de búsqueda. Los dos avisos del CGPJ a Igualdad y los 4.810 dispositivos constan solo en resultados de búsqueda. No abrí la Memoria de la Fiscalía.
- Resultado de la denuncia de Manos Limpias sobre Salazar; si Monedero ha recurrido ya su sanción.
- Sentencia del Constitucional sobre el conflicto del Senado por los Presupuestos: no encontrada.
- No reabrí las evidencias no listadas en el punto 2 (entre ellas PSOE igualdad e1, e2, e6, e8, e9 e instituciones e1-e4, e8-e10). La neutralidad se revisó a fondo en igualdad e instituciones y por búsqueda de términos en el resto.
- `out/` no se ha regenerado: hay que volver a ejecutar `build.py`.
