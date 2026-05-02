# NestJS CRUD Pattern

Genera un módulo CRUD completo para NestJS con TypeORM.

## Variables

| Nombre | Descripción | Ejemplo | Requerido |
|--------|-------------|---------|-----------|
| `entity` | Nombre de la entidad en PascalCase | `User` | ✅ |

## Uso

```bash
aris dev create nestjs-crud User
```

## Archivos generados

```
User/
├── user.controller.ts      # Controlador REST
├── user.service.ts         # Lógica de negocio
├── user.module.ts          # Módulo NestJS
├── entities/
│   └── user.entity.ts      # Entidad TypeORM
└── dto/
    ├── create-user.dto.ts  # DTO de creación
    └── update-user.dto.ts  # DTO de actualización
```

## Endpoints generados

- `POST /user` - Crear
- `GET /user` - Listar todos
- `GET /user/:id` - Obtener por ID
- `PATCH /user/:id` - Actualizar
- `DELETE /user/:id` - Eliminar
