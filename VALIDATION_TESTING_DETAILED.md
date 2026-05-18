# SCRIPT DE VALIDACIÓN - MATCH LINEUP

## Ejecución paso a paso en Swagger

### PREPARACIÓN: Obtener datos necesarios

#### 1. Obtener un partido en estado Scheduled
```
GET https://localhost:5001/api/match
Respuesta esperada:
[
  {
    "id": 3,
    "status": 0,  // 0 = Scheduled
    "homeTeamId": 1,
    "awayTeamId": 2,
    "matchDate": "2026-05-20T10:00:00"
  }
]

GUARDAR: 
- matchId = 3
- homeTeamId = 1  
- awayTeamId = 2
```

#### 2. Obtener jugadores del HomeTeam (id=1)
```
GET https://localhost:5001/api/player?teamId=1
Respuesta esperada:
[
  {
    "id": 5,
    "firstName": "Juan",
    "lastName": "Pérez",
    "teamId": 1,
    "number": 1,
    "position": 0  // GK
  },
  {
    "id": 6,
    "firstName": "Carlos",
    "lastName": "López",
    "teamId": 1,
    "number": 4,
    "position": 1  // CB
  },
  ...más jugadores...
]

GUARDAR: playerIdHomeTeam = 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
```

#### 3. Obtener jugadores del AwayTeam (id=2)
```
GET https://localhost:5001/api/player?teamId=2
GUARDAR: playerIdAwayTeam = 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
```

#### 4. Obtener jugador de un equipo diferente
```
Usar cualquier playerId de un equipo que NO sea 1 ni 2
GUARDAR: playerIdOtherTeam = 50 (ej)
```

#### 5. Obtener un partido en estado Finished
```
GET https://localhost:5001/api/match
GUARDAR: matchIdFinished = 1 (si existe con Status = 2)
```

---

## PRUEBAS - Copiar/Pegar en Swagger

### ✅ ESCENARIO 1: POST jugador titular HomeTeam
```
Endpoint: POST /api/match/3/lineup
Body:
{
  "playerId": 5,
  "isStarter": true,
  "position": "GK"
}

Resultado esperado: 201 Created
Respuesta:
{
  "id": 1,
  "matchId": 3,
  "playerId": 5,
  "playerName": "Juan Pérez",
  "teamName": "Team A",
  "isStarter": true,
  "position": "GK"
}
```

---

### ✅ ESCENARIO 2: POST jugador suplente AwayTeam
```
Endpoint: POST /api/match/3/lineup
Body:
{
  "playerId": 20,
  "isStarter": false,
  "position": "ST"
}

Resultado esperado: 201 Created
```

---

### ❌ ESCENARIO 3: POST jugador duplicado
```
Endpoint: POST /api/match/3/lineup
Body (mismo PlayerId que Escenario 1):
{
  "playerId": 5,
  "isStarter": false,
  "position": "LW"
}

Resultado esperado: 409 Conflict
Error: "El jugador ya está registrado en la alineación de este partido"
```

---

### ❌ ESCENARIO 4: POST jugador de equipo diferente
```
Endpoint: POST /api/match/3/lineup
Body:
{
  "playerId": 50,
  "isStarter": true,
  "position": "CM"
}

Resultado esperado: 409 Conflict
Error: "El jugador no pertenece a ninguno de los equipos del partido"
```

---

### ❌ ESCENARIO 5: POST 12° titular (agregar 11 primero, luego el 12°)
```
Primero, agregar 11 titulares del HomeTeam:
Ejecutar 11 veces:
POST /api/match/3/lineup
Body (incrementar playerId cada vez):
{
  "playerId": 5,
  "isStarter": true,
  "position": "GK"
}
{
  "playerId": 6,
  "isStarter": true,
  "position": "CB"
}
{
  "playerId": 7,
  "isStarter": true,
  "position": "CB"
}
{
  "playerId": 8,
  "isStarter": true,
  "position": "LB"
}
{
  "playerId": 9,
  "isStarter": true,
  "position": "RB"
}
{
  "playerId": 10,
  "isStarter": true,
  "position": "CDM"
}
{
  "playerId": 11,
  "isStarter": true,
  "position": "CDM"
}
{
  "playerId": 12,
  "isStarter": true,
  "position": "CM"
}
{
  "playerId": 13,
  "isStarter": true,
  "position": "LW"
}
{
  "playerId": 14,
  "isStarter": true,
  "position": "RW"
}
{
  "playerId": 15,
  "isStarter": true,
  "position": "ST"
}

Luego, intentar agregar el 12°:
POST /api/match/3/lineup
Body:
{
  "playerId": 16,
  "isStarter": true,
  "position": "CAM"
}

Resultado esperado: 409 Conflict
Error: "El equipo ya tiene 11 titulares registrados en este partido"
```

---

### ❌ ESCENARIO 6: POST a partido Finished
```
Endpoint: POST /api/match/1/lineup
Body:
{
  "playerId": 5,
  "isStarter": true,
  "position": "GK"
}

Resultado esperado: 409 Conflict
Error: "Solo se pueden registrar alineaciones en partidos Scheduled"
(Nota: Usa matchIdFinished si el Status es 2 = Finished)
```

---

### ✅ ESCENARIO 7: GET alineación completa
```
Endpoint: GET /api/match/3/lineup

Resultado esperado: 200 OK
Respuesta (array):
[
  {
    "id": 1,
    "matchId": 3,
    "playerId": 5,
    "playerName": "Juan Pérez",
    "teamName": "Team A",
    "isStarter": true,
    "position": "GK"
  },
  {
    "id": 2,
    "matchId": 3,
    "playerId": 20,
    "playerName": "Pedro González",
    "teamName": "Team B",
    "isStarter": false,
    "position": "ST"
  },
  ...más jugadores...
]

Nota: Ordenados por IsStarter DESC, luego Position ASC
```

---

### ✅ ESCENARIO 8: GET alineación por equipo
```
Endpoint: GET /api/match/3/lineup/team/1

Resultado esperado: 200 OK
Respuesta (solo del HomeTeam):
[
  {
    "id": 1,
    "matchId": 3,
    "playerId": 5,
    "playerName": "Juan Pérez",
    "teamName": "Team A",
    "isStarter": true,
    "position": "GK"
  },
  ...solo jugadores de Team 1...
]
```

---

### ✅ ESCENARIO 9: DELETE un jugador
```
Endpoint: DELETE /api/match/3/lineup/1

Resultado esperado: 204 No Content
(Sin body en respuesta)

Verificación:
GET /api/match/3/lineup
Confirmar que el jugador con id=1 ya no aparece
```

---

### ❌ ESCENARIO 10: DELETE con ID inexistente
```
Endpoint: DELETE /api/match/3/lineup/99999

Resultado esperado: 404 Not Found
Error: "No se encontró la alineación con ID 99999 en el partido 3"
```

---

## 📋 Checklist de Validación

Marca cada escenario cuando lo valides:

- [ ] Escenario 1 ✅ POST titular HomeTeam → 201
- [ ] Escenario 2 ✅ POST suplente AwayTeam → 201
- [ ] Escenario 3 ❌ POST duplicado → 409
- [ ] Escenario 4 ❌ POST equipo diferente → 409
- [ ] Escenario 5 ❌ POST 12° titular → 409
- [ ] Escenario 6 ❌ POST partido Finished → 409
- [ ] Escenario 7 ✅ GET completa → 200
- [ ] Escenario 8 ✅ GET por equipo → 200
- [ ] Escenario 9 ✅ DELETE → 204
- [ ] Escenario 10 ❌ DELETE no existe → 404

---

## 🎯 Resultado Final

Todos los escenarios deben pasar para que la implementación sea correcta.

**Total esperado:** 10/10 ✅

