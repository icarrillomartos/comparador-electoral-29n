# Revisión independiente · Frente Amplio y SALF

Fecha: 24-11-2026. Archivos: `datos/frenteamplio.json` y `datos/salf.json` (7 contrastes cada uno). No se ha cambiado ningún `nivel`, ninguna `cita` ni `pagina`. Los dos JSON son válidos y conservan esquema e `id`.

Aviso de método: la herramienta de búsqueda se cortó a mitad del trabajo por un límite de uso. Parte de las comprobaciones se hicieron descargando la página o el PDF oficial directamente y leyendo el texto. El muestreo de SALF quedó por debajo de 3 aperturas en cuatro contrastes (se detalla abajo).

## 1. Frente Amplio

### Cambios

| Dónde | Qué | Por qué |
|---|---|---|
| igualdad e6 | `estado_judicial` de `condenado_firme` a `null`; añadido asunto C-70/24 y fecha del recurso (30-1-2024) | La condena es al Reino de España, no a una persona ni a un partido |
| igualdad, `puntos.historial.por` | «hubo condena del TJUE» pasa a «el TJUE condenó a España» | Evita atribuir la condena al espacio |
| igualdad e7 | Título y hecho reescritos | El artículo dice que la Comisión «ha abierto» un procedimiento, no que lo «mantiene»; no da fecha ni fase |
| igualdad e1 y `antecedentes`; empleo e6 y `matiz` | El programa de 2019 se atribuye a Unidas Podemos y se aclara que Podemos no está en el Frente Amplio | Se usaba un programa de Podemos como antecedente propio sin decir que Podemos concurre por separado |
| empleo y vivienda, `matiz` | Añadida frase sobre qué es el Frente Amplio y quién lo integra | Punto pedido por el editor (ver abajo) |
| empleo e3 | Fuente sustituida por el Diario de Sesiones del Congreso; hecho ajustado | Fuente primaria: 348 votos emitidos, 178 a favor, 170 en contra; expediente 121/000058 |
| vivienda e2 | Desglose corregido | Las 4.600 viviendas incluyen 600 aún sin terminar en abril de 2023 |
| vivienda e3 | Añadida la previsión municipal (12.000) | El artículo daba 12.000 como previsión; 11.500 procede de otro medio |
| sanidad e7 y `refutacion` | Añadido el dato de 2019 (6,0 % del PIB) | Comparar solo con 2020 (año de pandemia) exagera la caída |
| sanidad, `matiz` | Añadido que no dirigían Hacienda | Matiz de socio minoritario |
| exterior, `matiz` | «se triplicó entre 2018 y 2026 con gobiernos de los que formaban parte» pasa a las cifras 2020-2025 | Entraron en el Gobierno en enero de 2020, no en 2018 |
| Varias `refutacion` y `nota` | Añadido resultado de la revisión | Trazabilidad |

### Cómo y cuándo se constituyó el Frente Amplio

- La marca la decidió en septiembre de 2026 la mesa de partidos de Más Madrid, IU, Movimiento Sumar y Comuns (El Salto, 25-9-2026). El 4-10-2026 fijaron el 17-10 para la presentación (Orain). Ada Colau fue designada candidata el 12-10-2026.
- Once organizaciones registradas (Artículo14, 7-11-2026, citando a EFE): IU, Movimiento Sumar, Catalunya en Comú, Más Madrid, Chunta Aragonesista, Izquierda Asturiana, Recortes Cero, Batzarre, Iniciativa del Pueblo Andaluz, Verdes Equo y Somos Partido Progresista.
- CHA concurre en Aragón como «Chunta Aragonesista-Frente Amplio Aragón» y, según Demócrata (18-10-2026), es socia electoral sin integrarse en la estructura. Verdes Equo va en «Frente Amplio por Andalucía». Compromís va en coalición propia en la Comunitat Valenciana. Podemos no forma parte.
- Los textos no daban por hecha la composición de forma errónea (hablan de «sus partidos» y «el espacio»). El fallo era otro: usar el programa de Podemos de 2019 como antecedente sin aclaración. Corregido.
- No se encontró la fecha exacta de registro de la coalición ante la Junta Electoral.

### Evidencias verificadas abriendo la fuente (4 o más por contraste)

- **Empleo**: e3 (Diario de Sesiones, coincide), e4 (BOE, coincide), e7 (coincide; lo «desfavorable» del dictamen consta en Onda Vasca), e8 (coincide), e9 (coincide).
- **Vivienda**: e1 (coincide; la cifra de 200.000 no está en esa pieza), e2 (corregida), e3 (matizada), e4, e5, e7 (coinciden), e8 (fallo leído en BOE), e9 (solo acredita el primer decreto).
- **Impuestos**: e3 (Agencia Tributaria), e6 (BOE y crónica), e7, e8 (BOCG leído), e9. Todas coinciden.
- **Sanidad**: e2, e4, e7 (PDF del Ministerio) coinciden; e5 solo parcialmente (sumario de la referencia; importe y prima sin releer).
- **Igualdad**: e5 (BOE), e6 (coincide; estado judicial corregido), e7 (corregida), e8 (El Salto no nombra el ministerio; consta en El Debate).
- **Inmigración**: e2, e3, e4, e6, e8. Todas coinciden.
- **Exterior**: e1 (PDF de la OTAN, todas las cifras exactas), e2, e3, e4, e5, e6 (nota de Hacienda), e7, e9. Todas coinciden.

### Puntos concretos del editor

- **Votación del 10-9-2025**: confirmada en fuente primaria. Enmiendas de devolución de Junts, Vox y PP aprobadas por 178 a 170 (348 emitidos). El voto de UPN solo consta en prensa.
- **Vivienda en Barcelona 2015-2023**: no se pudo abrir el balance municipal ni informe de Sindicatura (el repositorio municipal dio error de certificado). Las cifras siguen apoyadas en dos medios que citan al Ayuntamiento. Queda dicho en la nota de e2 y en `refutacion`.
- **Gasto en defensa**: confirmado en el PDF de la OTAN (0,92 % en 2018; 1,00 % en 2020; 2,00 % estimado en 2025; 33.123 millones).
- **Socio minoritario**: el matiz ya estaba en vivienda, impuestos, inmigración y exterior; reforzado en sanidad.

### Evidencias eliminadas

Ninguna.

### Niveles que propongo revisar (no cambiados)

- **Empleo, historial: de 1 a 2.** El proyecto se aprobó en Consejo de Ministros y lo rechazaron otros grupos; no es «mayormente incumplido» por decisión propia. Las 35 horas en la Administración son de un ministerio del PSOE, lo que resta, pero el SMI sí es de Trabajo.

### Sin comprobar

- Balance municipal de Barcelona y cualquier informe de Sindicatura.
- BOE del Real Decreto 853/2026 (Plan Veo) e importe exacto de Muface.
- Sentencia C-70/24 en su texto original.
- Segundo decreto de vivienda del 2-10-2026 (resultado 166-184) en fuente primaria.
- Si el registro horario se aprobó después del 28-9-2026: la búsqueda no encontró nada, pero no se revisó el BOE día a día.
- Balance oficial de la regularización posterior a julio de 2026.

## 2. SALF

### Cambios

| Dónde | Qué | Por qué |
|---|---|---|
| vivienda e1; impuestos e1 y e5; instituciones-4 e7 | `verificado:true`, nota «comprobado en el PDF oficial descargado» | Instrucción del editor; cifras recomprobadas en `texto/salf.txt` |
| vivienda e5 | `verificado:true`; hecho con los apartados exactos | Art. 91 leído en el BOE: 10 % viviendas, 4 % protección oficial de régimen especial o promoción pública |
| seguridad e7 (nueva) | Cifra oficial de homicidios | Interior, balance del 4.º trimestre de 2025: 376 en 2025, 349 en 2024 (+7,7 %), provisional. Coincide con la del programa |
| instituciones-2 e1 | Título, hecho y nota reescritos | Estado exacto: 5 suplicatorios pedidos, 2 concedidos, 5 causas en instrucción, 1 sobreseída |
| instituciones-2 e2 | Hecho ajustado; lo de las cuentas pasa a e9 | Mezclaba una investigación penal con un hecho administrativo distinto |
| instituciones-2 e3 | Fecha, importe y declaración posterior añadidos; retirada la sanción de 2026 por grabar a un eurodiputado | La segunda sanción es disciplinaria, sin relación con la promesa |
| instituciones-2 e7 | **Eliminada** | Ver abajo |
| instituciones-2 e9 (nueva) | Tribunal de Cuentas y cuentas de las europeas | Punto pedido por el editor |
| instituciones-2 `resumen`, `antecedentes`, `matiz`, `refutacion`, `coherencia.por` | Reescritos | Fechas de suplicatorios, versión del interesado, retirada de las condenas civiles |
| exterior e5 | `estado_judicial` a `null`; retirada la causa por presunto acoso; de `contradice` a `contexto` | La causa no guarda relación con el referéndum |
| exterior e4 | De `contradice` a `contexto` | Su actividad en el Parlamento Europeo no hace menos creíble el referéndum |
| seguridad, exterior, instituciones-4 `refutacion` | Resultado de la revisión | Trazabilidad |

### Estado de las causas en el Tribunal Supremo a 24-11-2026

Todas en instrucción: `investigado`. No se encontró auto de procesamiento ni apertura de juicio en ninguna.

| Causa | Suplicatorio pedido | Parlamento Europeo |
|---|---|---|
| Presunta financiación ilegal y delito electoral (100.000 euros) | 14-10-2025 | Concedido el 19-5-2026 |
| Presunto acoso a una fiscal | fecha no localizada | Concedido el 28-4-2026 |
| Presunto acoso y revelación de secretos a dos eurodiputados | mayo de 2026 | No consta resolución |
| Presuntas coacciones o amenazas al alcalde de Algeciras | julio de 2026 | No consta resolución |
| Presunta provocación a desórdenes públicos | 5-11-2026 | Pendiente |
| Falsa PCR atribuida a Salvador Illa | no se pidió | Sobreseída el 5-11-2026; auto recurrible |

### Condenas civiles y decisión de pertinencia

- Firmes: 7.000 euros a Ana Pastor (Tribunal Supremo, 2024) y 10.000 euros al jefe superior de Policía de Canarias (el Supremo inadmitió la casación; noticia de 9-10-2026).
- No consta firmeza: 60.000 euros a José Luis Ábalos (primera instancia, marzo de 2025). La búsqueda menciona otra de 20.000 euros (mayo de 2025), no abierta.
- **Decisión: eliminada e7 de `salf-instituciones-2`.** Son condenas por intimidad, imagen y honor. No son corrupción y no hacen más ni menos creíble la promesa. El `matiz` conserva solo «no consta ninguna condena penal».

### Lo que quedó sin verificar y se intentó completar

- **Sueldo después de octubre de 2025**: nada nuevo. Ni sorteo, ni donación aceptada, ni destinatario. Maldita mantiene sin veredicto desde el 14-5-2026 la afirmación de los 242.000 euros.
- **Sanción del Parlamento Europeo**: confirmada. 31-3-2025, dos días sin dietas (676 euros según EFE; unos 700 según elDiario.es). En junio de 2025 declaró 783.200 euros de ingresos de 2021 a 2024.
- **Tribunal de Cuentas**: confirmado a través de elDiario.es, que cita literalmente el informe. SALF, única de nueve que no presentó la contabilidad; subvención no adjudicada de 962.350,26 euros. Él dice que las registró en plazo. El informe original no se abrió. Nada sobre cuentas de 2025-2026.
- **Homicidios**: confirmado en el PDF de Interior.

### Evidencias verificadas abriendo la fuente

- **Vivienda**: e1 (programa), e5 (BOE). Solo 2.
- **Impuestos**: e1, e5 (programa), e3 (crónica). 3.
- **Seguridad**: e1, e4, e7. 3. La nota de Sanidad de e3 no cargó.
- **Inmigración**: e1, e3 (BOE). Solo 2. Euronews (e4) no cargó.
- **Instituciones-2**: e1, e2, e3, e9, más la fuente de e7 antes de eliminarla. 5.
- **Exterior**: e3. Solo 1.
- **Instituciones-4**: e2, e4, e7. 3.

### Niveles que propongo revisar (no cambiados)

- **Instituciones-2, viabilidad (1)**: la justificación termina en «SALF parte de cero escaños». La regla dice que la viabilidad no mide escaños. El nivel 1 se sostiene por la reforma constitucional de tres quintos; conviene quitar esa coletilla.
- **Instituciones-4, historial (1)**: sigue provisional. Sin datos posteriores a octubre de 2025 no hay base para subirlo ni bajarlo.

### Sin comprobar

- Resolución del Parlamento Europeo sobre los suplicatorios tercero, cuarto y quinto.
- Fecha en que se pidió el suplicatorio de la causa de la fiscal.
- Informe original del Tribunal de Cuentas.
- Evidencia repetida «sin escaños en las autonómicas de 2026» (no muestreada).
- Fondo de decomisos (e3 de seguridad), tasas de expulsión (e4 de inmigración), reglamento de retorno (e5), datos de El Debate sobre actividad parlamentaria.
