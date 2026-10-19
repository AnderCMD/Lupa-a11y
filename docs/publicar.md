# Publicar Lupa A11y

La publicación es **automática** al subir una etiqueta `vX.Y.Z` desde `main`: ver [flujo-de-trabajo.md](flujo-de-trabajo.md) (pasos, secretos y protección de ramas).

## Publicación manual (solo si la automática no está disponible)

Haz esto únicamente en una emergencia, desde un commit de `main` ya validado. Una versión publicada no se puede borrar del todo.

1. `npm ci && npm run lint && npm test && npm run test:integration`.
2. `npm run package` y revisa el `.vsix` con `npx vsce ls --no-dependencies`.
3. Marketplace: `VSCE_PAT=… npx vsce publish --packagePath lupa-a11y-<versión>.vsix`.
4. Open VSX: `npx ovsx publish lupa-a11y-<versión>.vsix -p <OVSX_PAT>`.
5. npm: `npm run build:lib && npm publish ./dist-lib --access public` (con sesión iniciada en npm).
6. `git tag v<versión> && git push origin v<versión>` solo si no se hizo antes (dispararía el workflow de release).
