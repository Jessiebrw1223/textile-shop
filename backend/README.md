# TextileOasis Backend

## Ejecutar

```bash
cd backend
# restaurar paquetes
dotnet restore TextileOasis.slnx
# iniciar la API y crear SQLite automáticamente
dotnet run --project TextileOasis.API
```

La API quedará en `http://localhost:5004`.

## Credenciales admin seed

- correo: `admin@textileoasis.com`
- contraseña: `Admin123*`

## Base de datos

Se crea automáticamente un archivo SQLite llamado `TextileOasis.db`.
