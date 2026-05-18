# 🧪 GUÍA VISUAL DE VALIDACIÓN - MATCH LINEUP

## 🎯 Objetivo
Validar que los 10 escenarios de prueba funcionen correctamente en Swagger.

---

## 📌 PASO 1: Preparar la Aplicación

### 1.1 Iniciar la API
```
En Visual Studio:
1. Haz clic en el botón de play (Debug) o presiona F5
2. Espera a que se compile y se abra el navegador
3. Debería abrir: https://localhost:5001/swagger (o similar)
```

### 1.2 Acceder a Swagger
```
URL: https://localhost:5001/swagger

Deberías ver:
- Lista de controladores en el lado izquierdo
- Busca "MatchLineup" (debería estar al final)
- Haz clic para expandir los endpoints
```

---

## 📋 PASO 2: Obtener IDs Necesarios

### 2.1 Obtener Match ID
```
1. En Swagger, busca "Match" → GET /api/match
2. Haz clic en "Try it out"
3. Haz clic en "Execute"
4. En la respuesta, copia el "id" de un match con "status": 0
   - Status 0 = Scheduled ✅
   - Status 1 = InProgress ❌
   - Status 2 = Finished ❌

GUARDAR: matchId = [el número que copiaste]
GUARDAR: homeTeamId = [id del equipo local]
GUARDAR: awayTeamId = [id del equipo visitante]
```

**Ejemplo de respuesta:**
```json
[
  {
    "id": 3,
    "tournamentId": 1,
    "homeTeamId": 1,
    "awayTeamId": 2,
    "refereeId": 1,
    "matchDate": "2026-05-20T10:00:00",
    "venue": "Estadio Principal",
    "matchday": 1,
    "status": 0,        // ← Buscamos esto = 0 (Scheduled)
    "createdAt": "2026-01-15T12:00:00",
    "updatedAt": null
  }
]
```

### 2.2 Obtener Player IDs del HomeTeam
```
1. En Swagger, busca "Player" → GET /api/player
2. Haz clic en "Try it out"
3. En los parámetros, rellena: teamId = [el homeTeamId que guardaste]
4. Haz clic en "Execute"
5. Copia los primeros 11 "id" de jugadores

GUARDAR: playerIdHome = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
```

### 2.3 Obtener Player IDs del AwayTeam
```
1. Repite el paso anterior pero con teamId = [el awayTeamId]
2. Copia los primeros 5 "id" de jugadores del AwayTeam

GUARDAR: playerIdAway = [20, 21, 22, 23, 24, 25]
```

### 2.4 Obtener Match ID Finished
```
1. En Swagger, busca Match → GET /api/match
2. Haz clic en "Try it out" → "Execute"
3. Copia el "id" de un match con "status": 2 (Finished)
   Si no existe, usa el matchId del Paso 2.1 pero salta el Escenario 6

GUARDAR: matchIdFinished = [número]
```

---

## ✅ PASO 3: Ejecutar los 10 Escenarios

### ESCENARIO 1: POST Titular HomeTeam (201)
```
1. En Swagger, busca "MatchLineup" → POST /api/match/{matchId}/lineup
2. Haz clic en "Try it out"
3. Rellena {matchId} con el número que guardaste en Paso 2.1
4. En el body JSON, reemplaza con:

{
  "playerId": 5,
  "isStarter": true,
  "position": "GK"
}

5. Haz clic en "Execute"

✅ VERIFICAR:
- Código de respuesta debe ser 201 Created
- El body debe contener:
  - "id": algún número
  - "matchId": el que enviaste
  - "playerId": 5
  - "playerName": "nombre del jugador"
  - "teamName": "nombre del equipo"
  - "isStarter": true
  - "position": "GK"

✏️ GUARDAR PARA DESPUÉS:
El "id" de la respuesta (ej: "id": 1) lo necesitarás para el Escenario 9
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "matchId": 3,
  "playerId": 5,
  "playerName": "Juan Pérez López",
  "teamName": "Arsenal",
  "isStarter": true,
  "position": "GK"
}
```

---

### ESCENARIO 2: POST Suplente AwayTeam (201)
```
1. Mismo endpoint: POST /api/match/{matchId}/lineup
2. Haz clic en "Try it out"
3. Rellena {matchId} igual que antes
4. Body JSON:

{
  "playerId": 20,
  "isStarter": false,
  "position": "ST"
}

5. Haz clic en "Execute"

✅ VERIFICAR:
- Código 201 Created
- "isStarter": false
- "position": "ST"
- "playerName" diferente al Escenario 1
- "teamName" diferente (debe ser el AwayTeam)
```

---

### ESCENARIO 3: POST Jugador Duplicado (409)
```
1. Mismo endpoint: POST /api/match/{matchId}/lineup
2. Haz clic en "Try it out"
3. Body JSON (MISMO playerId que Escenario 1):

{
  "playerId": 5,
  "isStarter": false,
  "position": "LW"
}

4. Haz clic en "Execute"

❌ VERIFICAR:
- Código de respuesta debe ser 409 Conflict
- El message debe ser: "El jugador ya está registrado en la alineación de este partido"
```

**Respuesta esperada:**
```json
{
  "message": "El jugador ya está registrado en la alineación de este partido"
}
```

---

### ESCENARIO 4: POST Equipo Diferente (409)
```
1. Necesitas un playerId de un equipo que NO sea HomeTeam (1) ni AwayTeam (2)
   Por ejemplo: si el equipo 3 tiene jugadores, usa playerIdTeam3
   O en Swagger: GET /api/player → busca un playerName de otro equipo

2. POST /api/match/{matchId}/lineup
3. Haz clic en "Try it out"
4. Body JSON:

{
  "playerId": 50,
  "isStarter": true,
  "position": "CM"
}

5. Haz clic en "Execute"

❌ VERIFICAR:
- Código 409 Conflict
- Message: "El jugador no pertenece a ninguno de los equipos del partido"
```

---

### ESCENARIO 5: POST 12° Titular (409)
```
Este es el más complejo porque requiere agregar 11 titulares primero.

PARTE A: Agregar 11 titulares
1. POST /api/match/{matchId}/lineup
2. Repite 11 veces (una por cada jugador):

Iteración 1:
Body: {"playerId": 5, "isStarter": true, "position": "GK"}
Result: 201 ✅

Iteración 2:
Body: {"playerId": 6, "isStarter": true, "position": "CB"}
Result: 201 ✅

... (continuar hasta 11)

Iteración 11:
Body: {"playerId": 15, "isStarter": true, "position": "ST"}
Result: 201 ✅

PARTE B: Intentar agregar el 12°
12. Body (con playerId diferente):

{
  "playerId": 16,
  "isStarter": true,
  "position": "CAM"
}

❌ VERIFICAR:
- Código 409 Conflict
- Message: "El equipo ya tiene 11 titulares registrados en este partido"
```

---

### ESCENARIO 6: POST Partido Finished (409)
```
1. Necesitas un matchId con Status = 2 (Finished)
   Si no existe, salta este escenario y marca como "No Aplicable"

2. POST /api/match/{matchId}/lineup (usar matchIdFinished)
3. Haz clic en "Try it out"
4. Body JSON:

{
  "playerId": 5,
  "isStarter": true,
  "position": "GK"
}

5. Haz clic en "Execute"

❌ VERIFICAR:
- Código 409 Conflict
- Message: "Solo se pueden registrar alineaciones en partidos Scheduled"
```

---

### ESCENARIO 7: GET Alineación Completa (200)
```
1. GET /api/match/{matchId}/lineup
2. Haz clic en "Try it out"
3. NO rellenar parámetros (o dejar el {matchId} del Paso 2.1)
4. Haz clic en "Execute"

✅ VERIFICAR:
- Código 200 OK
- Respuesta es un ARRAY []
- Contiene al menos 2 elementos (del Escenario 1 y 2)
- Cada elemento tiene: id, matchId, playerId, playerName, teamName, isStarter, position
- ORDEN: Titulares primero (isStarter: true), luego suplentes
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "matchId": 3,
    "playerId": 5,
    "playerName": "Juan Pérez López",
    "teamName": "Arsenal",
    "isStarter": true,
    "position": "GK"
  },
  {
    "id": 3,
    "matchId": 3,
    "playerId": 6,
    "playerName": "Carlos López",
    "teamName": "Arsenal",
    "isStarter": true,
    "position": "CB"
  },
  {
    "id": 2,
    "matchId": 3,
    "playerId": 20,
    "playerName": "Pedro González",
    "teamName": "Manchester",
    "isStarter": false,
    "position": "ST"
  }
]
```

---

### ESCENARIO 8: GET Alineación por Equipo (200)
```
1. GET /api/match/{matchId}/lineup/team/{teamId}
2. Haz clic en "Try it out"
3. Rellena:
   - {matchId} = el del Paso 2.1
   - {teamId} = homeTeamId (ej: 1)
4. Haz clic en "Execute"

✅ VERIFICAR:
- Código 200 OK
- Respuesta es un ARRAY []
- SOLO contiene jugadores del equipo especificado
- Si usa homeTeamId=1, solo verá al "Juan Pérez López" (no a "Pedro González")

REPETIR con AwayTeam:
5. Rellena {teamId} = awayTeamId
6. Verifica que ahora solo vea al AwayTeam
```

---

### ESCENARIO 9: DELETE Jugador (204)
```
1. DELETE /api/match/{matchId}/lineup/{lineupId}
2. Haz clic en "Try it out"
3. Rellena:
   - {matchId} = el del Paso 2.1
   - {lineupId} = el "id" que guardaste del Escenario 1 (ej: 1)
4. Haz clic en "Execute"

✅ VERIFICAR:
- Código 204 No Content
- NO hay body en respuesta
- Ejecuta GET (Escenario 7) y verifica que el jugador desapareció
```

---

### ESCENARIO 10: DELETE No Existe (404)
```
1. DELETE /api/match/{matchId}/lineup/{lineupId}
2. Haz clic en "Try it out"
3. Rellena:
   - {matchId} = el del Paso 2.1
   - {lineupId} = 99999 (un número que NO existe)
4. Haz clic en "Execute"

❌ VERIFICAR:
- Código 404 Not Found
- Message: "No se encontró la alineación con ID 99999 en el partido 3"
```

---

## 📊 CHECKLIST FINAL

Marca cada escenario cuando lo hayas probado:

```
PREPARACIÓN
☐ Obtuve matchId (Status=0)
☐ Obtuve 11+ playerIds del HomeTeam
☐ Obtuve 5+ playerIds del AwayTeam
☐ Obtuve matchIdFinished (si existe)

ESCENARIOS
☐ Escenario 1: 201 ✅ (titular homeTeam)
☐ Escenario 2: 201 ✅ (suplente awayTeam)
☐ Escenario 3: 409 ❌ (duplicado)
☐ Escenario 4: 409 ❌ (equipo diferente)
☐ Escenario 5: 409 ❌ (12° titular)
☐ Escenario 6: 409 ❌ (partido finished) [OPCIONAL si no hay finished]
☐ Escenario 7: 200 ✅ (GET completa)
☐ Escenario 8: 200 ✅ (GET por equipo)
☐ Escenario 9: 204 ✅ (DELETE)
☐ Escenario 10: 404 ❌ (DELETE no existe)

RESULTADO: 10/10 ✅ APROBADO
```

---

## 🎓 Conclusión

Si todos los escenarios pasan correctamente:
1. Haz screenshot de Swagger
2. Haz commit con mensaje "Validar todos los escenarios Match Lineup"
3. Push a GitHub
4. ¡Listo para usar en producción! 🚀

