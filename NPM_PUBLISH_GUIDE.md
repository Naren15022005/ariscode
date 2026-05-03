# 📦 Guía para Publicar ArisCode CLI en npm

## ✅ Todo está listo. Solo faltan 3 comandos.

Tu repositorio ya tiene todo preparado. Solo necesitas ejecutar estos comandos:

---

## 🔐 Paso 1: Verificar que estás logueado en npm

```bash
npm whoami
```

**Resultado esperado:**
```
tu-usuario-npm
```

Si no te sale nada, primero haz login:

```bash
npm login
```

Te pedirá:
- Username: `tu-usuario-npm`
- Password: `tu-contraseña-npm`
- Email: `tu-email@example.com`

---

## 🚀 Paso 2: Verificar el paquete antes de publicar

```bash
cd C:\Users\alfon\Documents\Proyectos\ariscode
npm pack --dry-run
```

**Resultado esperado:**
```
npm notice package: ariscode-cli@1.1.0
npm notice Tarball Contents
...
npm notice Tarball Details
npm notice name: ariscode-cli
npm notice version: 1.1.0
npm notice filename: ariscode-cli-1.1.0.tgz
npm notice package size: 20.4 kB
npm notice unpacked size: 68.8 kB
npm notice total files: 39
```

Si ves esto, significa que TODO está configurado correctamente. ✅

---

## 📤 Paso 3: Publicar en npm

```bash
npm publish
```

**Resultado esperado:**
```
npm notice
npm notice 📦 ariscode-cli@1.1.0
npm notice === Tarball Details ===
npm notice name:          ariscode-cli
npm notice version:       1.1.0
npm notice package size:  20.4 kB
npm notice unpacked size: 68.8 kB
npm notice shasum:        [hash]
npm notice integrity:     sha512-[...]
npm notice total files:   39
npm notice
+ ariscode-cli@1.1.0
```

¡LISTO! Tu paquete está publicado. 🎉

---

## ✨ Paso 4: Verificar en npm

Abre tu navegador y ve a:

```
https://www.npmjs.com/package/ariscode-cli
```

Deberías ver:
- ✅ Tu nombre como autor
- ✅ Descripción completa
- ✅ Badge de downloads
- ✅ README renderizado
- ✅ Versión 1.1.0

---

## 🧪 Paso 5: Probar la instalación global (opcional)

Ahora CUALQUIERA en el mundo puede hacer:

```bash
npm install -g ariscode-cli
aris dev create react-component Test
```

Para probarlo tú mismo en otra carpeta:

```bash
# Crea una carpeta de prueba
mkdir ~/test-aris && cd ~/test-aris

# Instala desde npm
npm install -g ariscode-cli

# Usa la CLI
aris dev sync
aris dev search
aris dev create react-component TestComp
```

---

## 📊 Qué se publica

Archivo: `ariscode-cli-1.1.0.tgz` (20.4 KB)

Contenido:
```
✅ dist/              - Código compilado (JavaScript)
✅ patterns/          - 4 patterns (react-component, nestjs-crud, etc)
✅ README.md          - Documentación de npm
✅ CHANGELOG.md       - Histórico de cambios
✅ package.json       - Metadatos
```

**NO se publica:**
- ❌ node_modules/ (descargados por npm)
- ❌ src/ (código TypeScript)
- ❌ tests/ (solo para desarrolladores)
- ❌ .git/ (historial)

---

## 🔄 Actualizaciones futuras

Cuando tengas nuevas versiones:

1. Cambiar versión en `package.json`:
   ```json
   {
     "version": "1.2.0"
   }
   ```

2. Actualizar `CHANGELOG.md`

3. Hacer commit:
   ```bash
   git commit -am "chore: bump version to 1.2.0"
   git tag v1.2.0
   git push origin main v1.2.0
   ```

4. Publicar nuevamente:
   ```bash
   npm publish
   ```

npm automáticamente detecta la nueva versión y la publica.

---

## ⚠️ Cosas importantes

- **npm es público:** Cualquiera puede descargar `ariscode-cli`
- **No se puede unpublish:** Si publicas, queda publicado (aunque puedas deprecar versiones)
- **Sem-versioning:** Usa MAJOR.MINOR.PATCH (1.1.0 significa: v1 = major, .1 = minor, .0 = patch)
- **Scopes opcionales:** Si quisieras `@tuusuario/ariscode-cli`, cambia `package.json`:
  ```json
  {
    "name": "@tuusuario/ariscode-cli"
  }
  ```

---

## 🎯 Resumen

| Paso | Comando | Tiempo |
|------|---------|--------|
| 1 | `npm whoami` | < 1s |
| 2 | `npm pack --dry-run` | < 5s |
| 3 | `npm publish` | 5-10s |
| Total | — | < 20s |

---

## 📞 Si algo sale mal

### Error: "404 Unauthorized"
```
npm ERR! 404 PUT https://registry.npmjs.org/ariscode-cli
```
**Solución:** Probablemente el nombre ya existe. Intenta:
```bash
npm search ariscode-cli
```

Si está ocupado, cambia el nombre:
```json
{
  "name": "@tuusuario/ariscode-cli"
}
```

### Error: "401 Unauthorized"
```
npm ERR! 401 Unauthorized
```
**Solución:** No estás logueado. Haz:
```bash
npm login
npm publish
```

### Error: "ERR! no such file or directory, open ...."
**Solución:** Asegúrate de estar en la carpeta correcta:
```bash
cd C:\Users\alfon\Documents\Proyectos\ariscode
pwd  # Debe terminar en /ariscode
npm publish
```

---

## 🎉 ¡Lo hiciste!

Una vez publicado, tu CLI estará disponible en npm para que todos puedan usarla.

```bash
npm install -g ariscode-cli
aris dev create react-component MyApp
```

¡Felicidades! 🚀

---

**Nota:** Este documento se borra después de publicar. Solo es una guía de referencia.

