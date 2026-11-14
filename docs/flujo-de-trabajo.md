# Flujo de trabajo y releases

## Ramas

| Rama   | Para qué                                                           | Quién escribe                                                    |
| ------ | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `main` | **Producción.** Siempre publicable; cada versión sale de aquí.     | Solo PR desde `dev` (o `hotfix/*`)                               |
| `dev`  | **Desarrollo.** Rama de integración; aquí se acumulan los cambios. | PR desde ramas de trabajo (`feature/*`, `fix/*`, `traduccion/*`) |

`main` nunca recibe commits directos. La CI corre en ambas ramas y en todos los PR. Que los PR a `main` vengan de `dev` (o `hotfix/*`) es una convención: GitHub no lo bloquea, igual que en RizomaDB. El workflow **Promover dev a main** (Actions → _Run workflow_) abre ese PR por ti.

## Reglas configuradas en GitHub

Estado real del repositorio (Settings → Branches, Rules y Environments), alineado con RizomaDB. Si cambias algo allí, actualiza esta tabla.

| Dónde                    | Regla                                                                                                                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                   | Solo por PR. Checks obligatorios: `build` y `secrets` (gitleaks), ambos de la CI. CodeQL también corre, pero no bloquea.                                                                      |
| `main`                   | **La rama del PR debe estar al día con `main`** (_strict_). Si `main` avanzó, mezcla `main` en `dev` antes de mezclar el PR.                                                                  |
| `main`                   | Las reglas también aplican a administradores. Sin force push ni borrado. No hace falta aprobación de revisores.                                                                               |
| `dev`                    | Protegida contra force push y borrado. Admite push directo y no exige checks: la CI corre igual en cada push, revísala antes de abrir el PR a `main`.                                         |
| Repositorio              | Se admiten merge commit, squash y rebase. **Para `dev` → `main` usa merge commit**, así `dev` y `main` no divergen.                                                                           |
| Repositorio              | **Auto-merge desactivado**: el PR se mezcla a mano cuando la CI está en verde.                                                                                                                |
| Repositorio              | Las ramas se borran al mezclar su PR; `dev` y `main` no, porque están protegidas.                                                                                                             |
| Repositorio              | Ruleset "Copilot code review": Copilot revisa los PR automáticamente. Sus comentarios son sugerencias, no bloquean.                                                                           |
| Environment `production` | Solo admite etiquetas `v*`, sin aprobación: **subir la etiqueta publica sola** en el Marketplace y en npm. El nombre `production` lo usan las políticas de trusted publishing; no lo cambies. |
| Variables de Actions     | `PUBLISH_MARKETPLACE=true` y `PUBLISH_NPM=true`: cada etiqueta `vX.Y.Z` publica en ambos registros.                                                                                           |

## Día a día

1. Crea una rama desde `dev`: `git switch dev && git pull && git switch -c feature/lo-que-sea`.
2. Abre el PR **a `dev`**. Debe pasar la CI (lint, formato, tipos, tests, traducciones, build, librería npm, VS Code real, `.vsix`).
3. Anota el cambio en `CHANGELOG.md` bajo "Sin publicar".

## Sacar una versión

Todo el flujo es automático salvo tres pasos manuales: preparar, mezclar el PR y etiquetar. Al subir la etiqueta se publica sin más confirmaciones, así que revisa la versión antes.

Elige la versión con [SemVer](https://semver.org/lang/es/): **parche** (`1.0.4`) para correcciones, **menor** (`1.1.0`) para funciones o reglas nuevas, **mayor** (`2.0.0`) si quitas ajustes o cambias el comportamiento por defecto de forma incompatible.

```bash
# 1. En dev: sube la versión y cierra "Sin publicar" en el CHANGELOG
git switch dev && git pull
npm run release:prepare -- 0.1.0
git commit -am "Versión 0.1.0" && git push

# 2. PR de dev a main; cuando la CI esté en verde, mézclalo (merge commit)
#    Si GitHub dice que la rama no está al día: git merge origin/main en dev y push
gh workflow run promote.yml   # o: gh pr create --base main --head dev
gh pr merge --merge          # cuando build y secrets estén en verde

# 3. Etiqueta el commit de main: esto dispara el release
git switch main && git pull
git tag v0.1.0 && git push origin v0.1.0
```

Qué hace [`release.yml`](../.github/workflows/release.yml) al ver la etiqueta:

1. **Verifica**: la etiqueta está en `main`, coincide con `package.json`, el CHANGELOG tiene notas de esa versión, y pasan todos los checks, incluidos los tests en VS Code real.
2. Construye el `.vsix` y la librería `lupa-a11y-core`.
3. Crea el **GitHub Release** con el `.vsix` y las notas del CHANGELOG.
4. Publica en **Visual Studio Marketplace** y **npm**. Estos dos jobs usan el _environment_ `production`, que solo admite etiquetas `v*` y no pide aprobación.

**La publicación en registros es opcional.** Los jobs del Marketplace y de npm solo corren si en Settings → Secrets and variables → Actions → _Variables_ existen `PUBLISH_MARKETPLACE` y/o `PUBLISH_NPM` con valor `true`. Sin ellas, el release solo crea el GitHub Release con el `.vsix` adjunto, y puedes subir el `.vsix` a mano en <https://marketplace.visualstudio.com/manage> (_New extension_ → _Visual Studio Code_).

El Marketplace usa _trusted publishing_ (OIDC, sin PAT): en <https://marketplace.visualstudio.com/manage/publishers/andercmd/trustedpublishing> crea una política con proveedor GitHub Actions, propietario `AnderCMD`, repositorio `Lupa-a11y`, workflow `release.yml` y entorno `production`.

Los jobs de publicación son independientes: si uno falla (por ejemplo, una política de trusted publishing mal configurada), arréglala y usa "Re-run failed jobs"; los demás no se repiten.

**Pre-releases** (`v0.2.0-beta.1`): el Marketplace no admite versiones con sufijo, así que solo van a GitHub (marcado como pre-release) y a npm con el tag `next`.

**Ensayo**: en la pestaña Actions, "Release" → _Run workflow_ construye todo sin publicar nada.

## Librería npm (`lupa-a11y-core`)

`npm run build:lib` genera `dist-lib/` (ESM, CJS, tipos y su propio `package.json`, con la versión del proyecto). `npm run smoke:lib` la prueba como ESM y como CJS. En CI se comprueba además con `npm pack --dry-run`. El `package.json` raíz es `private`, así que es imposible publicar la extensión en npm por accidente.
