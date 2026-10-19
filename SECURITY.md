# Seguridad

Si encuentras una vulnerabilidad, **no abras un issue público**: usa [Security advisories](https://github.com/AnderCMD/Lupa-a11y/security/advisories/new) del repositorio.

Notas de diseño relevantes: la extensión no hace llamadas de red ni tiene telemetría; solo ejecuta la configuración de ESLint del proyecto en workspaces de confianza (Workspace Trust); el panel de explicación es un webview con CSP estricta y sin scripts.
