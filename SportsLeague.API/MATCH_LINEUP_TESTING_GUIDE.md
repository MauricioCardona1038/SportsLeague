# 🧪 GUÍA DE PRUEBAS: Match Lineup - Fase 7

## 📌 Contenido
1. [Configuración Inicial](#configuración-inicial)
2. [Pruebas Manuales en Swagger](#pruebas-manuales-en-swagger)
3. [Automatización con Postman](#automatización-con-postman)
4. [Automatización con REST Client (VS Code)](#automatización-con-rest-client-vs-code)
5. [Escenarios Esperados](#escenarios-esperados)

---

## ⚙️ Configuración Inicial

### Requisitos Previos
- Aplicación ejecutada: `dotnet run --project SportsLeague.API`
- Base de datos migrada (automático al ejecutar)
- Datos de prueba creados (torneos, equipos, jugadores)

### Variables de Configuración
```
baseUrl = http://localhost:5000/api
matchId = 1 (o el ID del partido de prueba)
homeTeamId = 1
awayTeamId = 2
homePlayer1Id = 1 (jugador del equipo HOME)
awayPlayerId = 3 (jugador del equipo AWAY)
```

### Crear Datos de Prueba (Swagger)
Antes de probar MatchLineup, necesitas:

1. **Crear un Torneo**
   - POST `/api/tournament`
   - Guarda el ID del torneo

2. **Crear 2 Equipos**
   - POST `/api/team` (Equipo 1)
   - POST `/api/team` (Equipo 2)

3. **Crear Jugadores**
   - POST `/api/player` con `teamId = 1` (mínimo 2 jugadores)
   - POST `/api/player` con `teamId = 2` (mínimo 1 jugador)

4. **Crear un Árbitro**
   - POST `/api/referee`

5. **Crear un Partido**
   - POST `/api/match`
   - `homeTeamId = 1`, `awayTeamId = 2`
   - `status = "Scheduled"` (por defecto)

---

## 🌐 Pruebas Manuales en Swagger

### Acceso a Swagger
URL: `https://localhost:7xxx/swagger` (el puerto varía)

### Orden de Ejecución de Escenarios

#### Escenario 1: ✅ POST Jugador Titular HomeTeam (201)
```json
POST /api/match/1/lineup
{
  "playerId": 1,
  "isStarter": true,
  "position": "GK"
}
```
**Resultado Esperado**: 201 Created
**Respuesta**: ID de la alineación creada

#### Escenario 2: ✅ POST Jugador Suplente AwayTeam (201)
```json
POST /api/match/1/lineup
{
  "playerId": 3,
  "isStarter": false,
  "position": "ST"
}
```
**Resultado Esperado**: 201 Created

#### Escenario 3: ❌ POST Mismo Jugador (409 Conflict)
```json
POST /api/match/1/lineup
{
  "playerId": 1,
  "isStarter": true,
  "position": "GK"
}
```
**Resultado Esperado**: 409 Conflict
**Mensaje**: "El jugador ya está registrado en la alineación de este partido"

#### Escenario 4: ❌ POST Jugador Inválido (409 Conflict)
```json
POST /api/match/1/lineup
{
  "playerId": 999,
  "isStarter": true,
  "position": "CB"
}
```
**Resultado Esperado**: 409 Conflict
**Mensaje**: "El jugador no pertenece a ninguno de los equipos del partido"

#### Escenario 5: ❌ POST 12° Titular (409 Conflict)
```
Primer: Crea 11 titulares del mismo equipo
Luego: POST el 12° titular
```
**Resultado Esperado**: 409 Conflict
**Mensaje**: "El equipo ya tiene 11 titulares registrados en este partido"

#### Escenario 6: ❌ POST a Partido Finished (409 Conflict)
```
Primero: Cambia el partido a status "Finished"
   PATCH /api/match/1/status
   { "status": "Finished" }

Luego: Intenta agregar alineación
   POST /api/match/1/lineup
```
**Resultado Esperado**: 409 Conflict
**Mensaje**: "Solo se pueden registrar alineaciones en partidos Scheduled"

#### Escenario 7: ✅ GET Alineación Completa (200)
```
GET /api/match/1/lineup
```
**Resultado Esperado**: 200 OK
**Respuesta**: Array de objetos MatchLineupDto

#### Escenario 8: ✅ GET Alineación por Equipo (200)
```
GET /api/match/1/lineup/team/1
```
**Resultado Esperado**: 200 OK
**Respuesta**: Array filtrado por equipo

#### Escenario 9: ✅ DELETE Alineación (204)
```
DELETE /api/match/1/lineup/{lineupId}
```
**Resultado Esperado**: 204 No Content

#### Escenario 10: ❌ DELETE ID Inexistente (404)
```
DELETE /api/match/1/lineup/9999
```
**Resultado Esperado**: 404 Not Found
**Mensaje**: "No se encontró la alineación con ID"

---

## 🤖 Automatización con Postman

### Instalación
1. Descarga [Postman](https://www.postman.com/downloads/)
2. Instala y abre

### Importar Colección
1. Click: **Import** (botón superior izquierdo)
2. Selecciona el archivo: `SportsLeague.API\MatchLineup_Postman_Collection.json`
3. Click: **Import**

### Configurar Variables
En Postman:
1. Click: **Environments** (lado izquierdo)
2. Crea un nuevo environment llamado "SportsLeague"
3. Agrega variables:
   - `baseUrl` = `http://localhost:5000/api`
   - `matchId` = `1`
   - `homeTeamId` = `1`
   - `awayTeamId` = `2`

### Ejecutar Pruebas
**Opción A: Una por una**
- Selecciona cada request
- Click: **Send**

**Opción B: Suite completa (automático)**
- Click: **Run** (botón azul)
- Selecciona la colección
- Click: **Run MatchLineup_Tests**
- Verás un reporte con:
  - ✅ Tests passed
  - ❌ Tests failed
  - ⏱️ Tiempo de ejecución

### Interpretar Resultados
- **Green**: Test pasó
- **Red**: Test falló
- Haz click en el test para ver detalles del error

---

## 📝 Automatización con REST Client (VS Code)

### Instalación
1. Extension: "REST Client" por Humao
2. Abre: `SportsLeague.API\MatchLineup.http`

### Ejecutar Requests
- Línea 1 de cada request tiene un botón **Send Request**
- Click para ejecutar
- La respuesta aparece en una pestaña nueva

### Ventajas
- No necesita herramienta externa
- Integrado en Visual Studio
- Rápido para desarrollo

---

## 📊 Escenarios Esperados

| # | Escenario | Método | Código | Validación |
|---|-----------|--------|--------|-----------|
| 1 | Titular HomeTeam | POST | 201 | Creado exitosamente |
| 2 | Suplente AwayTeam | POST | 201 | Creado exitosamente |
| 3 | Mismo Jugador | POST | 409 | Ya está registrado |
| 4 | Jugador Inválido | POST | 409 | No pertenece al equipo |
| 5 | 12° Titular | POST | 409 | Máximo 11 titulares |
| 6 | Partido Finished | POST | 409 | Estado inválido |
| 7 | GET Alineación | GET | 200 | Array de lineups |
| 8 | GET por Equipo | GET | 200 | Array filtrado |
| 9 | DELETE Lineup | DELETE | 204 | Sin contenido |
| 10 | DELETE Inválido | DELETE | 404 | No encontrado |

---

## 🔧 Validaciones Implementadas

```csharp
// V1: El partido debe existir
if (match == null) → 404 Not Found

// V2: El jugador debe existir
if (player == null) → 404 Not Found

// V3: El jugador debe pertenecer a los equipos del partido
if (player.TeamId != match.HomeTeamId && player.TeamId != match.AwayTeamId) 
  → 409 Conflict

// V4: Sin duplicados por partido
if (existingLineup != null) → 409 Conflict

// V5: Máximo 11 titulares
if (startersCount >= 11 && isStarter) → 409 Conflict

// V6: Partido en estado Scheduled
if (match.Status != Scheduled) → 409 Conflict
```

---

## 📝 Notas Importantes

1. **Estado del Partido**: Las alineaciones SOLO se pueden registrar en partidos con `status = "Scheduled"`
2. **Límite de Titulares**: 11 por equipo por partido. Los suplentes NO tienen límite.
3. **Índice Único**: BD previene duplicados en `(MatchId, PlayerId)`
4. **Relaciones**: 
   - Match → Lineup (1:N)
   - Player → Lineup (1:N)
   - Cascade Delete en Match (elimina alineaciones)

---

## 🐛 Troubleshooting

### Error: "Match not found"
→ Verifica que exista un partido con ese ID

### Error: "El jugador no pertenece"
→ El PlayerId debe estar en HomeTeam O AwayTeam

### Error: "Estado inválido"
→ El partido debe estar en "Scheduled", no "Finished"

### Error: "Ya está registrado"
→ El jugador ya tiene una alineación en ese partido

### Error 500 en Swagger
→ Verifica logs en consola de la aplicación

---

## 📚 Referencias

- **Patrón**: Similar a Goal y Card (Fase 5)
- **Validaciones**: Basadas en MatchValidationHelper
- **Endpoints**: Anidados bajo `/api/match/{matchId}`
- **DTOs**: CreateMatchLineupDto (entrada) y MatchLineupDto (salida)

