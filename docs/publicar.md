# Publicar Lupa A11y

Estos pasos son para quien mantiene el proyecto. **No publiques sin una decisión explícita**: una versión publicada no se puede borrar del todo.

## Antes de publicar

1. Actualiza `version` en `package.json` y mueve las entradas de "Sin publicar" en `CHANGELOG.md` a la nueva versión.
2. Comprueba que `npm run lint`, `npm test`, `npm run check:translations` y `npm run test:integration` pasan.
3. `npm run package` y revisa el `.vsix` (`npx vsce ls --no-dependencies`): debe incluir `dist/extension.js`, los iconos y `assets/brand/logo-mark.svg`.
4. Instala el `.vsix` en tu VS Code (`code --install-extension lupa-a11y-<version>.vsix`) y pruébalo con un `.tsx` real.

## Visual Studio Marketplace

1. Crea un editor (publisher) en <https://marketplace.visualstudio.com/manage> con el mismo id que `publisher` en `package.json` (hoy `andercmd`).
2. Crea un token de acceso personal en Azure DevOps con el ámbito **Marketplace → Manage**.
3. `npx vsce login andercmd` y luego `npx vsce publish --no-dependencies`.

## Open VSX

1. Crea una cuenta en <https://open-vsx.org> y un token de acceso; crea el namespace con `npx ovsx create-namespace andercmd -p <token>`.
2. `npx ovsx publish lupa-a11y-<version>.vsix -p <token>`.

## Después

Etiqueta la versión en git (`git tag v<version>`) y súbela. Los tokens nunca van al repositorio.
