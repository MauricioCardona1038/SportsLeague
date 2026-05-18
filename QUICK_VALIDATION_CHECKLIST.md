# TABLA DE VALIDACIÓN RÁPIDA - MATCH LINEUP

## 🎯 Checklist Interactivo

```
┌─────┬──────────────────────────────────────┬─────────┬──────────┬────────────────────────────────────────────┐
│ #   │ Escenario                            │ Método  │ Código   │ Validar                                    │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  1  │ POST titular del HomeTeam            │ POST    │ ✅ 201   │ Respuesta contiene playerName y teamName   │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  2  │ POST suplente del AwayTeam           │ POST    │ ✅ 201   │ IsStarter = false, respuesta correcta      │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  3  │ POST mismo jugador otra vez          │ POST    │ ❌ 409   │ Error: "ya está registrado"                │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  4  │ POST jugador de equipo diferente     │ POST    │ ❌ 409   │ Error: "no pertenece a ninguno"            │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  5  │ POST 12° titular (máx 11)            │ POST    │ ❌ 409   │ Error: "ya tiene 11 titulares"             │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  6  │ POST a partido Status = Finished     │ POST    │ ❌ 409   │ Error: "Scheduled"                         │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  7  │ GET alineación completa              │ GET     │ ✅ 200   │ Array con todos los jugadores              │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  8  │ GET alineación filtrada por equipo   │ GET     │ ✅ 200   │ Array solo del equipo especificado         │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│  9  │ DELETE un jugador de alineación      │ DELETE  │ ✅ 204   │ Confirmar con GET que desapareció          │
├─────┼──────────────────────────────────────┼─────────┼──────────┼────────────────────────────────────────────┤
│ 10  │ DELETE con ID inexistente            │ DELETE  │ ❌ 404   │ Error: "No se encontró la alineación"      │
└─────┴──────────────────────────────────────┴─────────┴──────────┴────────────────────────────────────────────┘
```

---

## 🔄 Orden Recomendado de Ejecución

### Bloque 1: Preparación (Obtener datos)
```
1. GET /api/match → Obtener matchId (Status=0) y teamIds
2. GET /api/player → Obtener playerIds
```

### Bloque 2: Validación Exitosa (2xx)
```
3. POST (Escenario 1) → 201 ✅
4. POST (Escenario 2) → 201 ✅
7. GET (Escenario 7) → 200 ✅
8. GET (Escenario 8) → 200 ✅
9. DELETE (Escenario 9) → 204 ✅
```

### Bloque 3: Validación de Errores (4xx)
```
5. POST (Escenario 3) → 409 ❌ (Duplicado)
6. POST (Escenario 4) → 409 ❌ (Equipo diferente)
10. DELETE (Escenario 10) → 404 ❌ (No existe)
```

### Bloque 4: Validaciones Complejas (4xx)
```
11. POST x11 (Escenario 5 - primer parte) → 201 ✅ (11 veces)
12. POST (Escenario 5 - 12°) → 409 ❌ (Máximo 11)
13. POST (Escenario 6) → 409 ❌ (Finished)
```

---

## 📝 Template de Respuestas

### 201 Created (POST exitoso)
```json
{
  "id": 1,
  "matchId": 3,
  "playerId": 5,
  "playerName": "Juan Pérez",
  "teamName": "Arsenal",
  "isStarter": true,
  "position": "GK"
}
```

### 409 Conflict (Validación fallida)
```json
{
  "message": "El jugador ya está registrado en la alineación de este partido"
}
```

### 404 Not Found
```json
{
  "message": "No se encontró la alineación con ID 99999 en el partido 3"
}
```

### 200 OK (GET lista)
```json
[
  {
    "id": 1,
    "matchId": 3,
    "playerId": 5,
    "playerName": "Juan Pérez",
    "teamName": "Arsenal",
    "isStarter": true,
    "position": "GK"
  },
  {
    "id": 2,
    "matchId": 3,
    "playerId": 6,
    "playerName": "Carlos López",
    "teamName": "Arsenal",
    "isStarter": true,
    "position": "CB"
  }
]
```

### 204 No Content (DELETE exitoso)
```
(Sin body)
```

---

## 💾 Parámetros por Escenario

| Escenario | Método | Endpoint | Body | Parámetros |
|-----------|--------|----------|------|-----------|
| 1 | POST | /api/match/{matchId}/lineup | `{playerId, isStarter:true, position}` | matchId=3 |
| 2 | POST | /api/match/{matchId}/lineup | `{playerId, isStarter:false, position}` | matchId=3 |
| 3 | POST | /api/match/{matchId}/lineup | `{playerId:MISMO, ...}` | matchId=3 |
| 4 | POST | /api/match/{matchId}/lineup | `{playerId:OTRO_EQUIPO, ...}` | matchId=3 |
| 5 | POST | /api/match/{matchId}/lineup | `{playerId, isStarter:true, ...}` x12 | matchId=3 |
| 6 | POST | /api/match/{matchId}/lineup | `{playerId, ...}` | matchId=FINISHED |
| 7 | GET | /api/match/{matchId}/lineup | - | matchId=3 |
| 8 | GET | /api/match/{matchId}/lineup/team/{teamId} | - | matchId=3, teamId=1 |
| 9 | DELETE | /api/match/{matchId}/lineup/{lineupId} | - | matchId=3, lineupId=1 |
| 10 | DELETE | /api/match/{matchId}/lineup/{lineupId} | - | matchId=3, lineupId=99999 |

---

## 🧪 Testing en Diferentes Browsers

### Swagger UI (Recomendado)
```
https://localhost:5001/swagger
→ Buscar "MatchLineup"
→ Click en cada endpoint
→ Click "Try it out"
→ Rellenar parámetros
→ Click "Execute"
```

### Postman (Alternativa)
```
1. Importar endpoints en colección
2. Configurar variables de entorno: {{matchId}}, {{playerId}}
3. Ejecutar escenarios secuencialmente
4. Verificar assertions
```

### cURL (Línea de comandos)
```bash
# Escenario 1
curl -X POST "https://localhost:5001/api/match/3/lineup" \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": 5,
    "isStarter": true,
    "position": "GK"
  }' \
  -k  # Ignorar certificado autofirmado

# Esperado: HTTP 201
```

---

## ✅ Criterios de Aceptación

- [ ] **Código HTTP:** Exacto (201, 200, 204, 409, 404)
- [ ] **Body JSON:** Presente en 2xx y 4xx (excepto 204)
- [ ] **Mensaje de Error:** Coincide con especificación
- [ ] **Campos en DTO:** Todos presentes (Id, MatchId, PlayerId, PlayerName, TeamName, IsStarter, Position)
- [ ] **Ordenamiento GET:** Titulares primero, luego suplentes
- [ ] **Índice Único:** No permite duplicados en BD
- [ ] **Validaciones:** Las 6 validaciones funcionan correctamente

---

## 🎓 Notas Pedagógicas

### ¿Por qué estos escenarios?

1. **Escenarios 1-2:** Verifican el camino feliz (Happy Path)
2. **Escenarios 3-6:** Verifican validaciones de negocio
3. **Escenarios 7-8:** Verifican queries/filtrados
4. **Escenarios 9-10:** Verifican eliminación y manejo de errores

### Patrones Usados

- **DTO Mapping:** MatchLineupDto responde con datos del Player y Team relacionados
- **Validaciones En Cascada:** Service valida antes de persistir
- **Índice Único:** La BD (Level 2) evita duplicados si falla el servicio (Level 1)
- **Soft Delete:** No implementado, solo DELETE lógico

---

## 🚀 Siguiente Paso

Una vez validados todos los escenarios:
1. Hacer commit con evidencia de pruebas (screenshots)
2. Crear un test automatizado (Unit/Integration)
3. Desplegar a entorno de preproducción
4. Documentar en API Documentation

