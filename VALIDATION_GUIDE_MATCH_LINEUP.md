# GUÍA DE VALIDACIÓN - MATCH LINEUP ENDPOINTS

## Prerequisitos
1. La aplicación debe estar corriendo en `https://localhost:5001` (o el puerto configurado)
2. Acceder a Swagger en: `https://localhost:5001/swagger`
3. Debe haber datos en la BD con al menos:
   - Un torneo (Tournament)
   - Al menos 2 equipos (Team)
   - Al menos 5 jugadores por equipo
   - Un partido (Match) en estado **Scheduled**

---

## ESCENARIO 1: POST un jugador titular del HomeTeam a un partido Scheduled
**Resultado esperado:** ✅ 201 (Created)

### Pasos:
1. Ir a Swagger → MatchLineup → POST `/api/match/{matchId}/lineup`
2. Reemplazar `{matchId}` con un ID de partido en estado Scheduled
3. En el body JSON enviar:
```json
{
  "playerId": <ID jugador del HomeTeam>,
  "isStarter": true,
  "position": "GK"
}
```
4. Hacer clic en "Try it out"
5. **Verificar:** Código HTTP 201 y respuesta con los datos del jugador

---

## ESCENARIO 2: POST un jugador suplente del AwayTeam al mismo partido
**Resultado esperado:** ✅ 201 (Created)

### Pasos:
1. Repetir el endpoint con:
```json
{
  "playerId": <ID jugador del AwayTeam>,
  "isStarter": false,
  "position": "ST"
}
```
2. **Verificar:** Código HTTP 201

---

## ESCENARIO 3: POST el mismo jugador otra vez al mismo partido
**Resultado esperado:** ❌ 409 (Conflict) - "El jugador ya está registrado en la alineación de este partido"

### Pasos:
1. Usar el MISMO PlayerId del Escenario 1
2. Cambiar position o isStarter para que se note la diferencia
3. Enviar POST
4. **Verificar:** Código HTTP 409 con mensaje de error

---

## ESCENARIO 4: POST un jugador que no pertenece a ninguno de los dos equipos
**Resultado esperado:** ❌ 409 (Conflict) - "El jugador no pertenece a ninguno de los equipos del partido"

### Pasos:
1. Buscar un jugador que pertenezca a un equipo diferente
2. Enviar POST con ese PlayerId
3. **Verificar:** Código HTTP 409

---

## ESCENARIO 5: POST un 12° titular para un equipo (ya hay 11)
**Resultado esperado:** ❌ 409 (Conflict) - "El equipo ya tiene 11 titulares registrados en este partido"

### Pasos:
1. Agregar 11 titulares del HomeTeam (Escenario 1, repite 11 veces con diferentes PlayerId)
2. Intentar agregar el 12° titular
3. **Verificar:** Código HTTP 409

**Alternativa rápida:**
- Si no tienes 11 jugadores, usa suplentes (isStarter: false) sin límite
- La validación solo aplica a titulares

---

## ESCENARIO 6: POST a un partido en estado Finished
**Resultado esperado:** ❌ 409 (Conflict) - "Solo se pueden registrar alineaciones en partidos Scheduled"

### Pasos:
1. Buscar o crear un partido con Status = Finished
2. Intentar agregar un jugador a ese partido
3. **Verificar:** Código HTTP 409

---

## ESCENARIO 7: GET la alineación completa del partido
**Resultado esperado:** ✅ 200 (OK) con lista de todos los jugadores

### Pasos:
1. Ir a Swagger → MatchLineup → GET `/api/match/{matchId}/lineup`
2. Usar el mismo matchId de los escenarios anteriores
3. Hacer clic en "Try it out"
4. **Verificar:** 
   - Código HTTP 200
   - Respuesta es un array de MatchLineupDto
   - Contiene todos los jugadores agregados en Escenarios 1 y 2

---

## ESCENARIO 8: GET la alineación filtrada por equipo
**Resultado esperado:** ✅ 200 (OK) con solo los jugadores del equipo

### Pasos:
1. Ir a Swagger → MatchLineup → GET `/api/match/{matchId}/lineup/team/{teamId}`
2. Reemplazar `{matchId}` y `{teamId}` (usar el HomeTeamId del partido)
3. Hacer clic en "Try it out"
4. **Verificar:**
   - Código HTTP 200
   - Respuesta solo tiene jugadores del equipo especificado

---

## ESCENARIO 9: DELETE un jugador de la alineación
**Resultado esperado:** ✅ 204 (No Content)

### Pasos:
1. Del Escenario 7, obtener el `Id` de una alineación (no confundir con PlayerId)
2. Ir a Swagger → MatchLineup → DELETE `/api/match/{matchId}/lineup/{lineupId}`
3. Enviar el matchId y lineupId
4. **Verificar:** 
   - Código HTTP 204
   - Ejecutar GET del Escenario 7 para confirmar que el jugador ya no aparece

---

## ESCENARIO 10: DELETE con ID inexistente
**Resultado esperado:** ❌ 404 (Not Found) - "No se encontró la alineación con ID..."

### Pasos:
1. Ir a Swagger → MatchLineup → DELETE `/api/match/{matchId}/lineup/{lineupId}`
2. Usar un lineupId que NO exista (ej: 99999)
3. **Verificar:** Código HTTP 404

---

## 📊 Tabla de Resumen

| # | Escenario | Método | Código HTTP | Estado |
|---|-----------|--------|-------------|--------|
| 1 | POST titular HomeTeam | POST | 201 | ✅ |
| 2 | POST suplente AwayTeam | POST | 201 | ✅ |
| 3 | POST jugador duplicado | POST | 409 | ❌ |
| 4 | POST jugador no pertenece | POST | 409 | ❌ |
| 5 | POST 12° titular | POST | 409 | ❌ |
| 6 | POST partido Finished | POST | 409 | ❌ |
| 7 | GET alineación completa | GET | 200 | ✅ |
| 8 | GET alineación por equipo | GET | 200 | ✅ |
| 9 | DELETE jugador | DELETE | 204 | ✅ |
| 10 | DELETE ID inexistente | DELETE | 404 | ❌ |

---

## 🔍 Cómo obtener IDs para las pruebas

### Paso 1: Obtener un partido Scheduled
```
GET /api/match
Busca un partido con Status = 0 (Scheduled)
Copia su Id y los HomeTeamId, AwayTeamId
```

### Paso 2: Obtener jugadores del HomeTeam
```
GET /api/player
Filtra los que tengan TeamId = HomeTeamId del partido
Selecciona 11 para probar el límite de titulares
```

### Paso 3: Obtener un partido Finished para Escenario 6
```
GET /api/match
Busca un partido con Status = 2 (Finished)
O crea uno actualizando el Status si es necesario
```

---

## 💡 Notas Importantes

1. **CreatedAt/UpdatedAt:** Se generan automáticamente en el servicio
2. **Posiciones válidas:** Usa valores como "GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"
3. **Índice único:** La BD previene insertar el mismo jugador dos veces (V4 está duplicada en BD y Servicio)
4. **Ordenamiento:** GET retorna titulares primero, luego suplentes, ordenados por posición
5. **Códigos de Estado:**
   - 201 = Creado exitosamente
   - 204 = Eliminado (sin contenido)
   - 404 = No encontrado
   - 409 = Conflicto (validación fallida)

---

## 📝 Ejemplo de Request/Response

### Request (POST - Escenario 1):
```json
{
  "playerId": 5,
  "isStarter": true,
  "position": "CB"
}
```

### Response (201 Created):
```json
{
  "id": 1,
  "matchId": 3,
  "playerId": 5,
  "playerName": "Juan Pérez",
  "teamName": "Arsenal",
  "isStarter": true,
  "position": "CB"
}
```

---

## ✅ Checklist Final

- [ ] Escenario 1: 201 ✅
- [ ] Escenario 2: 201 ✅
- [ ] Escenario 3: 409 ❌
- [ ] Escenario 4: 409 ❌
- [ ] Escenario 5: 409 ❌
- [ ] Escenario 6: 409 ❌
- [ ] Escenario 7: 200 ✅
- [ ] Escenario 8: 200 ✅
- [ ] Escenario 9: 204 ✅
- [ ] Escenario 10: 404 ❌

