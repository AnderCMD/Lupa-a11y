# Flujo de trabajo y releases

## Ramas

| Rama   | Para qué                                                           | Quién escribe                                                    |
| ------ | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `main` | **Producción.** Siempre publicable; cada versión sale de aquí.     | Solo PR desde `dev` (o `hotfix/*`)                               |
| `dev`  | **Desarrollo.** Rama de integración; aquí se acumulan los cambios. | PR desde ramas de trabajo (`feature/*`, `fix/*`, `traduccion/*`) |

`main` nunca recibe commits directos. La CI corre en ambas ramas y en todos los PR; el workflow "Guardia de main" rechaza PR a `main` que no vengan de `dev` o `hotfix/*`.

## Día a día

1. Crea una rama desde `dev`: `git switch dev && git pull && git switch -c feature/lo-que-sea`.
2. Abre el PR **a `dev`**. Debe pasar la CI (lint, formato, tipos, tests, traducciones, build, librería npm, VS Code real, `.vsix`).
3. Anota el cambio en `CHANGELOG.md` bajo "Sin publicar".

## Sacar una versión

Todo el flujo es automático salvo tres pasos manuales (preparar, aprobar, etiquetar).

```bash
# 1. En dev: sube la versión y cierra "Sin publicar" en el CHANGELOG
git switch dev && git pull
npm run release:prepare -- 0.1.0
git commit -am "Versión 0.1.0" && git push

# 2. PR de dev a main; cuando la CI esté en verde, mézclalo (merge commit)

# 3. Etiqueta el commit de main: esto dispara el release
git switch main && git pull
git tag v0.1.0 && git push origin v0.1.0
```

Qué hace [`release.yml`](../.github/workflows/release.yml) al ver la etiqueta:

1. **Verifica**: la etiqueta está en `main`, coincide con `package.json`, el CHANGELOG tiene notas de esa versión, y pasan todos los checks, incluidos los tests en VS Code real.
2. Construye el `.vsix` y la librería `lupa-a11y-core`.
3. Crea el **GitHub Release** con el `.vsix` y las notas del CHANGELOG.
4. Publica en **Visual Studio Marketplace** y **npm**. Estos dos jobs usan el _environment_ `production`, que puede exigir tu aprobación manual antes de publicar.

**La publicación en registros es opcional.** Los jobs del Marketplace y de npm solo corren si en Settings → Secrets and variables → Actions → _Variables_ existen `PUBLISH_MARKETPLACE` y/o `PUBLISH_NPM` con valor `true`. Sin ellas, el release solo crea el GitHub Release con el `.vsix` adjunto, y puedes subir el `.vsix` a mano en <https://marketplace.visualstudio.com/manage> (_New extension_ → _Visual Studio Code_).

Los jobs de publicación son independientes: si uno falla (por ejemplo, un token caducado), arregla el secreto y usa "Re-run failed jobs"; los demás no se repiten.

**Pre-releases** (`v0.2.0-beta.1`): el Marketplace no admite versiones con sufijo, así que solo van a GitHub (marcado como pre-release) y a npm con el tag `next`.

**Ensayo**: en la pestaña Actions, "Release" → _Run workflow_ construye todo sin publicar nada.

## Configuración única en GitHub

### Secretos (Settings → Secrets and variables → Actions)

| Secreto     | De dónde sale                                                                                                                                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VSCE_PAT`  | Token de Azure DevOps con el ámbito **Marketplace → Manage** (<https://dev.azure.com> → User settings → Personal access tokens, organización "All accessible organizations"). Antes crea el editor `AnderCMD` en <https://marketplace.visualstudio.com/manage>. |
| `NPM_TOKEN` | Token **Automation** (o granular con permiso de publicación) de <https://www.npmjs.com/settings/~/tokens>.                                                                                                                                                      |

**Aviso sobre `VSCE_PAT`:** según la [documentación oficial](https://code.visualstudio.com/api/working-with-extensions/publishing-extension), los PAT globales de Azure DevOps se retiran el **1 de diciembre de 2026**. Hasta entonces el PAT funciona; después hay que pasar a Microsoft Entra ID (workload identity federation) con `vsce publish --azure-credential` y quitar el secreto.

Los tokens nunca van al repositorio. Si falta alguno, su job falla con un mensaje claro y no se publica en ese destino.

### Environment `production`

Settings → Environments → **New environment** → `production` → _Required reviewers_: tú. Así cada publicación espera tu aprobación.

### Protección de ramas

Con la CLI de GitHub (`gh`), como administrador del repositorio:

```bash
# main: solo por PR, con la CI en verde y sin pushes forzados
gh api -X PUT repos/AnderCMD/Lupa-a11y/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["build", "origen-permitido"] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

# dev: CI en verde y sin pushes forzados
gh api -X PUT repos/AnderCMD/Lupa-a11y/branches/dev/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": false, "contexts": ["build"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

Si trabajas solo, `required_approving_review_count: 0` permite mezclar tu propio PR. Sube el número cuando haya más personas.

### Otros ajustes recomendados

- Settings → General → _Default branch_: `main`; permitir solo _Merge commits_ para `dev → main` (conserva el historial).
- Settings → Code security: activar Dependabot alerts, Dependabot security updates y Secret scanning. Dependabot ya abre PR a `dev` cada semana (`.github/dependabot.yml`).
- Social preview: ver [CONTRIBUTING.md](../CONTRIBUTING.md#marca).

> **Open VSX:** de momento no se publica ahí. Para añadirlo más adelante basta un job con `npx ovsx publish` y un secreto `OVSX_PAT` (token de <https://open-vsx.org/user-settings/tokens> y un namespace creado con `npx ovsx create-namespace`).

## Librería npm (`lupa-a11y-core`)

`npm run build:lib` genera `dist-lib/` (ESM, CJS, tipos y su propio `package.json`, con la versión del proyecto). `npm run smoke:lib` la prueba como ESM y como CJS. En CI se comprueba además con `npm pack --dry-run`. El `package.json` raíz es `private`, así que es imposible publicar la extensión en npm por accidente.
