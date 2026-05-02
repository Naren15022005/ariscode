# React Component Pattern

Genera un componente React funcional con TypeScript y CSS Modules.

## Variables

| Nombre | Descripción | Ejemplo | Requerido |
|--------|-------------|---------|-----------|
| `ComponentName` | Nombre del componente en PascalCase | `UserCard` | ✅ |

## Uso

```bash
aris dev create react-component UserCard
```

## Archivos generados

```
UserCard/
├── UserCard.tsx          # Componente React
└── UserCard.module.css   # Estilos CSS Modules
```

## Contenido del componente

- TypeScript estricto
- Props interface con `ComponentNameProps`
- CSS Modules importado
- Estructura básica con title y children

## Personalización

Editar los templates en `patterns/react-component/templates/`:
- `{{ComponentName}}.tsx.hbs` - Componente base
- `{{ComponentName}}.module.css.hbs` - Estilos base
