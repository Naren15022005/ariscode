# ArisCode CLI v1.1.0 Release

**Release Date:** May 2, 2026

## 🎯 Overview

ArisCode CLI v1.1.0 addresses critical bugs in template variable processing and introduces the new `dev sync` command for pattern management. All tests are passing (20/20).

## 🐛 Critical Fixes

### Fix 1: Variables in Template Filenames
**Problem:** Filenames containing Handlebars variables like `{{ComponentName}}.tsx` were not being processed.
- ❌ Before: Generated files named `{{ComponentName}}.tsx` (unusable)
- ✅ After: Files correctly named `TestButton.tsx` (working)

### Fix 2: Pattern Metadata Variable Mapping
**Problem:** Variables defined in `pattern.json` were not mapped to the template context.
- ❌ Before: Components had empty names `export const : React.FC`
- ✅ After: Names correctly filled `export const TestButton: React.FC`

## ✨ New Features

### 1. Command: `aris dev sync`
Synchronizes all patterns from disk to the knowledge base.
```bash
aris dev sync
# Output: ✅ Sincronizados 4 patterns: hello-world, react-component, nestjs-crud, hello-learned
```

### 2. Handlebars Helpers
New template helpers for text transformations:
- `{{pascalCase name}}` → PascalCase
- `{{kebabCase name}}` → kebab-case
- `{{snakeCase name}}` → snake_case
- `{{camelCase name}}` → camelCase
- `{{uppercase name}}` → UPPERCASE
- `{{lowercase name}}` → lowercase

### 3. Variable Validation
- Pre-generation checks for required variables
- Clear error messages with variable names and prompts
- Auto-generation of derived variables (e.g., entityPlural → products)

### 4. Improved Logging
Colored console output with emoji indicators:
- ✅ Success messages (green)
- ❌ Error messages (red)
- ℹ  Info messages (blue)
- 🔍 Debug messages (cyan)
- ⚠️  Warning messages (yellow)

### 5. Pattern Documentation
Added comprehensive README.md for each pattern:
- `patterns/react-component/README.md`
- `patterns/nestjs-crud/README.md`

## ✅ Testing

All tests passing (20/20):
```
Test Files: 9 passed (9)
Tests: 20 passed (20)
Duration: 4.95s
```

### New Tests
- `tests/create.test.ts` - Automated tests for template generation
  - React component generation with correct variable names
  - NestJS CRUD generation with entity mapping

## 📦 Binary Artifacts

### Windows
- **File:** `index-win.exe`
- **Size:** 64 MB
- **SHA256:** `19918608ef6e02476e3ccafd81c804261f8dce799e8d616c780e4235ebcbdadd`

### Linux
- **File:** `index-linux`
- **Size:** 72 MB
- **SHA256:** `e8f45a08aee81b45ff131ff3d8ff9002880dc31a155cc9b8ce33bcb1bc714728`

## 📝 Technical Changes

### Modified Files
- `src/lib/patterns.ts` - Fixed template rendering with variable name processing
- `src/commands/create.ts` - Added context building and validation
- `src/commands/dev.ts` - Registered new sync command
- `src/cli.ts` - Updated version to 1.1.0
- `package.json` - Version bump and script additions

### New Files
- `src/commands/sync.ts` - Pattern synchronization command
- `src/lib/logger.ts` - Colored logging utilities
- `tests/create.test.ts` - Automated test suite
- `patterns/*/README.md` - Pattern documentation

## 🚀 Quick Start

### Update
```bash
# macOS/Linux
curl -L https://github.com/Naren15022005/ariscode/releases/download/v1.1.0/index-linux -o aris && chmod +x aris

# Windows
Download: index-win.exe
```

### Use
```bash
# Create React component
aris dev create react-component UserCard

# Create NestJS CRUD module
aris dev create nestjs-crud Product

# Sync patterns
aris dev sync

# Search patterns
aris dev search
```

## 📋 Checklist

- [x] Critical bugs fixed (template variables)
- [x] New `dev sync` command
- [x] Handlebars helpers
- [x] Variable validation
- [x] All tests passing
- [x] Binary artifacts compiled
- [x] Documentation updated
- [x] CHANGELOG updated
- [x] Release notes prepared

## 🔄 Migration from v1.0.0

No breaking changes for end users. However:

**For Pattern Developers:**
- Templates now support variable names in filenames
- Use `{{ComponentName}}.tsx` pattern for automatic name processing
- Ensure `pattern.json` defines the `variables` array

Example:
```json
{
  "variables": [
    { 
      "name": "ComponentName", 
      "prompt": "Component name", 
      "required": true 
    }
  ]
}
```

## 🐞 Known Issues

None. This release contains critical fixes and is production-ready.

## 📞 Support

- Report issues: https://github.com/Naren15022005/ariscode/issues
- Documentation: https://github.com/Naren15022005/ariscode

---

**Contributors:** Naren15022005  
**License:** MIT
