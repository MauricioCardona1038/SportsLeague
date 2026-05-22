# 🗺️ EXPLICACIÓN: AutoMapper para MatchLineup

## 📝 Resumen de DTOs

### **CreateMatchLineupDto (ENTRADA)**
```csharp
public class CreateMatchLineupDto
{
	public int PlayerId { get; set; }        // Qué jugador agregar
	public bool IsStarter { get; set; }      // ¿Es titular o suplente?
	public string Position { get; set; }     // Posición (ej: "GK", "CB", "ST")
}
```
**Uso**: Cliente envía ESTO en POST `/api/match/{matchId}/lineup`

---

### **MatchLineupDto (SALIDA)**
```csharp
public class MatchLineupDto
{
	public int Id { get; set; }              // ID de la alineación
	public int MatchId { get; set; }         // ID del partido
	public int PlayerId { get; set; }        // ID del jugador
	public string PlayerName { get; set; }   // ⭐ Nombre completo (CALCULADO)
	public string TeamName { get; set; }     // ⭐ Nombre del equipo (CALCULADO)
	public bool IsStarter { get; set; }      // ¿Titular o suplente?
	public string Position { get; set; }     // Posición
}
```
**Uso**: API retorna ESTO en todas las respuestas GET/POST

---

## 🎯 Mapeos de AutoMapper

### **Mapeo 1: CreateMatchLineupDto → MatchLineup (ENTRADA)**
```csharp
CreateMap<CreateMatchLineupDto, MatchLineup>();
```

**Qué hace**:
- Copia automáticamente las propiedades con el MISMO NOMBRE:
  - `dto.PlayerId` → `lineup.PlayerId`
  - `dto.IsStarter` → `lineup.IsStarter`
  - `dto.Position` → `lineup.Position`

**Ejemplo en código**:
```csharp
var dto = new CreateMatchLineupDto 
{ 
	PlayerId = 5, 
	IsStarter = true, 
	Position = "CB" 
};

var lineup = _mapper.Map<MatchLineup>(dto);
// Resultado:
// lineup.PlayerId = 5
// lineup.IsStarter = true
// lineup.Position = "CB"
```

---

### **Mapeo 2: MatchLineup → MatchLineupDto (SALIDA)**
```csharp
CreateMap<MatchLineup, MatchLineupDto>()
	.ForMember(dest => dest.PlayerName,
		opt => opt.MapFrom(src => src.Player.FirstName + " " + src.Player.LastName))
	.ForMember(dest => dest.TeamName,
		opt => opt.MapFrom(src => src.Player.Team.Name));
```

**Desglose por partes**:

#### **Propiedades Automáticas** (se copian directamente)
```csharp
// Estos campos coinciden en nombre, se copian sin config:
src.Id          → dest.Id
src.MatchId     → dest.MatchId
src.PlayerId    → dest.PlayerId
src.IsStarter   → dest.IsStarter
src.Position    → dest.Position
```

#### **Propiedad Personalizada 1: PlayerName**
```csharp
.ForMember(dest => dest.PlayerName,
	opt => opt.MapFrom(src => src.Player.FirstName + " " + src.Player.LastName))
```

**Qué hace**:
- Toma las propiedades `FirstName` y `LastName` del objeto `Player` relacionado
- Las concatena con un espacio: `"Juan" + " " + "Pérez"` = `"Juan Pérez"`
- Las asigna al campo `PlayerName` del DTO

**Datos de Entrada**:
```
MatchLineup:
  - Id: 1
  - PlayerId: 5
  - Player (relación):
	- FirstName: "Juan"
	- LastName: "Pérez"
	- Team (relación):
	  - Name: "Equipo A"
```

**Resultado del Mapeo**:
```json
{
  "id": 1,
  "playerId": 5,
  "playerName": "Juan Pérez",    ← Resultado del ForMember
  "teamName": "Equipo A",
  ...
}
```

#### **Propiedad Personalizada 2: TeamName**
```csharp
.ForMember(dest => dest.TeamName,
	opt => opt.MapFrom(src => src.Player.Team.Name))
```

**Qué hace**:
- Navega a través de relaciones: `MatchLineup` → `Player` → `Team`
- Extrae el nombre del equipo: `src.Player.Team.Name`
- Lo asigna a `TeamName` del DTO

**Ruta de Navegación**:
```
MatchLineup
	└── Player (relación FK)
		└── Team (relación FK)
			└── Name ("Equipo A")
```

---

## 🔄 Flujo Completo en el Controller

### **Escenario: POST Crear Alineación**

```csharp
[HttpPost]
public async Task<ActionResult<MatchLineupDto>> CreateLineup(int matchId, CreateMatchLineupDto dto)
{
	// PASO 1: Cliente envía esto
	// {
	//   "playerId": 5,
	//   "isStarter": true,
	//   "position": "CB"
	// }

	// PASO 2: Mapear DTO a Entidad
	var lineup = _mapper.Map<MatchLineup>(dto);
	// lineup = MatchLineup { PlayerId: 5, IsStarter: true, Position: "CB" }

	// PASO 3: Guardar en BD
	var result = await _matchLineupService.CreateLineupAsync(matchId, lineup);
	// result = MatchLineup { Id: 1, MatchId: 1, PlayerId: 5, IsStarter: true, Position: "CB", 
	//                        Player: { FirstName: "Juan", LastName: "Pérez", Team: { Name: "Equipo A" } } }

	// PASO 4: Mapear Entidad a DTO (con PlayerName y TeamName calculados)
	var resultDto = _mapper.Map<MatchLineupDto>(result);
	// resultDto = MatchLineupDto { 
	//   Id: 1, 
	//   MatchId: 1, 
	//   PlayerId: 5, 
	//   PlayerName: "Juan Pérez",   ← Calculado por ForMember
	//   TeamName: "Equipo A",        ← Calculado por ForMember
	//   IsStarter: true, 
	//   Position: "CB" 
	// }

	// PASO 5: Retornar al cliente
	return CreatedAtAction(nameof(GetLineupByMatch), new { matchId }, resultDto);
	// Response 201 Created con los datos mapeados
}
```

---

## 📊 Comparación: Manual vs AutoMapper

### **SIN AutoMapper (Manual)**
```csharp
var dtos = lineups.Select(l => new MatchLineupDto
{
	Id = l.Id,
	MatchId = l.MatchId,
	PlayerId = l.PlayerId,
	PlayerName = $"{l.Player.FirstName} {l.Player.LastName}",  // Manual
	TeamName = l.Player.Team.Name,                               // Manual
	IsStarter = l.IsStarter,
	Position = l.Position
});
```

**Problemas**:
- ❌ Código repetido en múltiples endpoints
- ❌ Si cambias la estructura del DTO, hay que actualizar todos los controladores
- ❌ Difícil de mantener

---

### **CON AutoMapper**
```csharp
var dtos = _mapper.Map<IEnumerable<MatchLineupDto>>(lineups);
```

**Ventajas**:
- ✅ Una sola línea
- ✅ Configuración centralizada en MappingProfile
- ✅ Cambios en un solo lugar
- ✅ Reutilizable en todos los controladores
- ✅ Menos código, más limpio

---

## 🎓 Cómo Funciona `.ForMember()`

### **Sintaxis General**
```csharp
.ForMember(
	dest => dest.PropiededadDestino,                    // La propiedad en el DTO
	opt => opt.MapFrom(src => src.CalculoPersonalizado) // Cómo calcularla desde la entidad
)
```

### **Casos de Uso en el Proyecto**

| DTO | ForMember | Uso |
|-----|-----------|-----|
| **PlayerResponseDTO** | TeamName | `src.Team.Name` |
| **TournamentResponseDTO** | TeamsCount | `src.TournamentTeams.Count()` |
| **GoalResponseDTO** | PlayerName | `src.Player.FirstName + " " + src.Player.LastName` |
| **MatchLineupDto** | PlayerName | `src.Player.FirstName + " " + src.Player.LastName` |
| **MatchLineupDto** | TeamName | `src.Player.Team.Name` |

---

## ✅ Validación de Mapeos

### **Test Manual en Postman**
```json
POST /api/match/1/lineup
Request Body:
{
  "playerId": 1,
  "isStarter": true,
  "position": "GK"
}

Response (201 Created):
{
  "id": 123,
  "matchId": 1,
  "playerId": 1,
  "playerName": "Juan Pérez",      ← Mapeado correctamente
  "teamName": "Manchester United", ← Mapeado correctamente
  "isStarter": true,
  "position": "GK"
}
```

---

## 🔧 Cómo Agregar Nuevos Mapeos

Si necesitas agregar un nuevo mapeo (ej: MatchEvent):

```csharp
// En MappingProfile.cs
CreateMap<CreateMatchEventDto, MatchEvent>();

CreateMap<MatchEvent, MatchEventDto>()
	.ForMember(dest => dest.PlayerName,
		opt => opt.MapFrom(src => src.Player.FirstName + " " + src.Player.LastName))
	.ForMember(dest => dest.TeamName,
		opt => opt.MapFrom(src => src.Player.Team.Name));
```

---

## 📚 Referencias

- **Documentación AutoMapper**: https://docs.automapper.org/
- **Patrón DTO**: Data Transfer Object - Separa transferencia de datos del dominio
- **Configuración centralizada**: Todos los mapeos en un lugar (MappingProfile)
- **Mantenibilidad**: Cambios en estructura de datos en un solo lugar

