Desarrolladores power users que ya están en terminal y quieren la máxima velocidad. La CLI es la primera interfaz que debe construirse porque valida toda la lógica del core engine.

10.1.2 Comandos Principales
dev create <descripción>: Genera código a partir de una descripción.
dev search <consulta>: Busca patrones disponibles.
dev analyze <archivo|directorio>: Analiza código existente.
dev error <mensaje>: Busca solución a un error.
dev learn <ruta>: Aprende un nuevo patrón desde código existente.
dev update: Sincroniza con GitHub manualmente.
dev status: Muestra estado de la base de conocimiento.
dev compare <archivo> --with <patrón>: Compara código con un pattern de referencia.


Semana 1: Fundamentos
Configuración del monorepo (pnpm workspaces o Turborepo).
Diseño y creación del esquema SQLite.
Implementación del Pattern Matcher básico (búsqueda full-text).
Carga de los primeros 10 patrones manuales (NestJS CRUD básicos).

Semana 2: Generación
Implementación del Code Generator con Handlebars.
Sistema de variables y prompts interactivos.
Pruebas con 5 patrones reales completos.
Sistema de archivos: creación de directorios, escritura de archivos.

Semana 3: CLI
Setup de Commander.js.
Comando dev create funcional.
Comando dev search funcional.
Mejora de UX: spinners, colores, output formateado.

Semana 4: Polish y Patrones Iniciales
Carga de 20 patrones iniciales (NestJS, Laravel, React).
Comando dev error con base de 30 errores comunes.
Documentación de uso (README detallado).
Tests unitarios del core (al menos 70% cobertura).

Hito Fase 1
Al final del mes 1, ya tienes una herramienta CLI funcional que generes proyectos NestJS y Laravel desde la terminal en segundos. Es el MVP que ya usas diariamente.


12.2 Fase 2: Análisis de Código + GitHub Sync (Mes 2)
Semana 5: Analyzer Básico
Integración de @babel/parser para JS/TS.
Detección de tipos de archivo (controller, service, etc.).
Cálculo de métricas básicas (complejidad, líneas).
Comando dev analyze funcional.

Semana 6: Analyzer Avanzado
Detector de patrones de diseño.
Detector de duplicación.
Comparador con knowledge base.
Generación de diagramas Mermaid.

Semana 7: GitHub Scraper
Cliente Octokit con rate limiting.
Filtros de calidad de repositorios.
Extractor de patrones desde awesome lists.
Sistema de scoring.

Semana 8: Auto-Update
Cron job para sincronización diaria.
Versionado de patrones (no sobrescribir personalizados).
Comando dev update y dev status.
Carga inicial: 200+ patrones desde GitHub.
