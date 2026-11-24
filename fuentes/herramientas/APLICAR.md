# Aplicar los hallazgos de la auditoría

Ahora aplicas tus propios hallazgos al archivo que auditaste. Hazlo con un script de Python que cargue el JSON **tal como está ahora en disco** (ha cambiado desde que lo leíste: se añadieron propuestas), modifique solo lo necesario y lo vuelva a escribir con `json.dump(..., ensure_ascii=False, indent=1)`. No toques `propuestas` ni ninguna clave fuera de tu ámbito.

## Qué aplicar

Aplica un hallazgo solo si su `confianza` es alta o media **y** abriste una URL que lo respalda. Los de confianza baja no se aplican: van a la lista de pendientes.

- **hecho_incorrecto / contexto / judicial / clasificacion / redaccion**: corrige el texto mínimo necesario en la evidencia (`hecho`, `titulo`, `fecha`, `sentido`, `estado_judicial`, `nota`) y, si la misma afirmación aparece en `resumen`, `antecedentes`, `matiz`, `refutacion`, `que_paso`, `dato_actual` o en el `por` de algún nivel, corrígela también allí para que todo sea coherente. Si una evidencia no tiene relación real con la promesa, elimínala y quita sus referencias (e3, e7…) de los textos.
- **fuente_primaria**: sustituye `url` y `fuente` por el documento oficial solo si lo abriste y dice lo mismo; pon `fuente_unica: false` y `verificado: true`.
- **falta_evidencia**: añade la evidencia con el siguiente `id` libre (e11, e12…) y los mismos campos que las demás (`id, sentido, componente, tipo, titulo, hecho, fecha, fuente, url, estado_judicial, fuente_unica, verificado, nota`). `verificado: true` solo si abriste esa URL; si la conoces por un buscador, `verificado: false`. Menciona el hecho nuevo en una frase del `resumen` (o de `que_paso` en el balance) si cambia la lectura.
- **Datos desfasados** (balance: `dato_actual`): actualiza `texto`, `fuente`, `url` con el dato más reciente que abriste.
- **Evidencias redundantes**: elimina las que señalaste como redundantes o poco pertinentes solo si queda al menos otra evidencia que sostenga el mismo hecho; mantén siempre un mínimo de 5 evidencias por promesa y al menos una en cada sentido cuando existía.
- **Comentarios de proceso**: borra de cualquier texto frases internas del tipo «se agotó el presupuesto de búsquedas», «el editor puede valorar», «no verifiqué…» cuando ya lo has verificado; si sigue sin verificar, déjalo dicho de forma neutra en `nota`.

## Qué NO aplicar

- **No cambies ningún `nivel` de `puntos`** (ni `estado` en el balance). Eso lo decide el editor. Sí puedes corregir el texto `por` cuando cita un hecho que has corregido.
- No reescribas por estilo. No añadas adjetivos ni intenciones. Estado judicial exacto siempre.
- No añadas nada que no hayas comprobado en una URL.

## Comprobaciones finales (hazlas en el script)

- El JSON carga; cada contraste conserva `propuesta_id, promesa, ha_gobernado, resumen, antecedentes, matiz, refutacion, puntos, evidencias`; cada evidencia tiene todos sus campos, `id` único dentro de su promesa y `url` que empieza por http.
- Ningún texto cita un `eN` que ya no existe.

## Qué devolver

Escribe un registro en la ruta que se te indica, JSON:
`{"aplicados": [{"donde": "...", "cambio": "una frase: antes → después"}], "no_aplicados": [{"donde": "...", "motivo": "..."}], "niveles_a_decidir": [{"donde": "pp-igualdad-1/puntos.historial", "nivel_actual": 3, "nivel_propuesto": 2, "motivo": "una o dos frases con el hecho que lo justifica", "confianza": "alta|media|baja"}], "estados_a_decidir": [...igual, solo balance...]}`

Mensaje final: tres líneas con el número de cambios aplicados, no aplicados y niveles a decidir.
