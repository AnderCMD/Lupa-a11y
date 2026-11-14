## Qué cambia

<!-- Describe el cambio y por qué. -->

## Tipo

- [ ] Traducción nueva o mejorada
- [ ] Quick fix
- [ ] Soporte de un framework (Vue, Svelte, Astro, Angular, HTML…)
- [ ] Corrección de un error
- [ ] Otro

## Lista de comprobación

- [ ] El PR apunta a `dev` (solo `dev` y `hotfix/*` van a `main`)
- [ ] `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test` y `npm run check:translations` pasan
- [ ] Si es una traducción: sigue la guía de estilo de CONTRIBUTING.md y trae fixtures `malo.tsx` y `bueno.tsx` (o un caso en `test/frameworks.test.ts` para Vue/HTML)
- [ ] Si toca la normalización de plantillas: no cambia longitudes ni saltos de línea
- [ ] Si es un quick fix: no inventa contenido descriptivo y tiene test
- [ ] Actualicé `CHANGELOG.md` en "Sin publicar"
