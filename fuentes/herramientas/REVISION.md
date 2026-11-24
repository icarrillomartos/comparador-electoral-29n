# Comparador 29N · encargo de revisión independiente

Eres revisor, no autor. Otro investigador escribió los archivos que te toca auditar. Tu trabajo es encontrar lo que está mal y corregirlo, con el mismo listón para todos los partidos. Lee antes `tools/BRIEF.md` (reglas con las que se escribió). Hoy es 24-11-2026; tu memoria sobre 2026 no es fiable: comprueba en la web.

Carpeta: `/Users/ivancarrillo/Documents/second-brain-ivan-5.1/scratch/469740e6b2a1edea/`. Solo puedes modificar los archivos de `datos/` que se te asignan y crear tu registro `datos/revision-<nombre>.md`.

## Qué revisar en cada contraste (y en cada compromiso del balance)

1. **Neutralidad del texto** (`promesa`, `resumen`, `antecedentes`, `matiz`, `refutacion`, `por` de cada punto, `titulo` y `hecho` de cada evidencia):
   - Fuera adjetivos valorativos y verbos que atribuyen intención («oculta», «presume», «miente», «pretende», «se escuda», «incumple sistemáticamente»…). Sustituye por el hecho.
   - ¿Leería esto como justo un votante de ese partido y también uno de su principal rival? Si no, reescribe.
   - ¿El `matiz` cumple su función (evitar la lectura injusta en cualquier dirección)?
2. **Asuntos judiciales y personales**: el `estado_judicial` debe ser exacto y estar actualizado a noviembre de 2026 (compruébalo). Solo se pone en evidencias sobre personas o partidos sometidos a un procedimiento; ponlo a `null` si se refiere a otra cosa (por ejemplo, una condena a España ante el TJUE). Nada de vida privada salvo que conste en resolución judicial y sea pertinente a la promesa. Si una evidencia sobre una persona no guarda relación directa con la promesa contrastada, elimínala.
3. **Pertinencia y sentido**: cada evidencia debe hablar de la promesa. ¿Está bien clasificada como `apoya`, `contradice` o `contexto`? Un hecho que no hace más ni menos creíble el cumplimiento es `contexto`.
4. **Verificación por muestreo**: abre (WebFetch) como mínimo las 3 evidencias más graves o más decisivas de cada contraste (prioriza las que `contradice`, las judiciales, las de `fuente_unica` y las cifras llamativas). Comprueba que la página dice exactamente lo que afirma el `hecho` (cifras, fechas, quién, qué). Corrige el hecho si difiere; si la URL no lo sostiene, busca una fuente mejor (primaria si es posible) y sustitúyela; si no la encuentras, pon `verificado:false` con `nota`, o elimina la evidencia si es grave y no está sostenida.
5. **Fuentes flojas**: sustituye Wikipedia por la fuente primaria (BOE, Congreso, CGPJ, sentencias) siempre que puedas. Toda evidencia debe tener una `url` http(s) válida: si falta, búscala o elimina la evidencia.
6. **Prueba de refutación**: ¿de verdad se intentó en los dos sentidos? Si ves un hecho muy difundido que el texto da por bueno y es falso o engañoso (o al revés), corrígelo.
7. **Equilibrio**: si un contraste solo tiene evidencia en un sentido, busca activamente la contraria durante unos minutos; si existe, añádela.
8. **Puntuación**: NO cambies los `nivel`. Si crees que alguno no se ajusta a los anclajes del BRIEF, anótalo en tu registro con el nivel que propones y por qué. Recuerda la regla: la **viabilidad** mide el obstáculo jurídico, competencial y presupuestario, no si el partido tendrá escaños suficientes para una mayoría ordinaria o absoluta.

No toques `propuestas[].cita` ni `pagina` (ya están validadas contra el PDF). Puedes mejorar `titulo` y `resumen` de una propuesta si no son neutrales o claros.

## Entrega

- Guarda los JSON corregidos en el mismo archivo, válidos (`python3 -c "import json;json.load(open('…'))"`), conservando el esquema y los `id`.
- Escribe `datos/revision-<nombre>.md`: lista de cambios (qué, por qué), evidencias verificadas abriendo la URL (id y resultado), evidencias eliminadas, niveles que propones cambiar, y lo que no pudiste comprobar.
- Mensaje final: 10-15 líneas con recuento de cambios, los 3 problemas más serios que encontraste y lo que queda dudoso.
