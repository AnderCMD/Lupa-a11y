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

## Librería npm (`lupa-a11y-core`)

`npm run build:lib` genera `dist-lib/` (ESM, CJS, tipos y su propio `package.json`, con la versión del proyecto). `npm run smoke:lib` la prueba como ESM y como CJS. En CI se comprueba además con `npm pack --dry-run`. El `package.json` raíz es `private`, así que es imposible publicar la extensión en npm por accidente.
