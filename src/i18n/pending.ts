/**
 * Reglas de eslint-plugin-jsx-a11y marcadas explícitamente como "pendientes de
 * traducir". Mientras estén aquí se muestran con el mensaje original de ESLint y
 * el sufijo " (sin traducir)".
 * Al traducir una, muévela a `src/i18n/es/` y quítala de esta lista.
 */
export const PENDING_RULES: readonly string[] = [
  // Obsoletas en el plugin: no están en el preset y no se traducen.
  "jsx-a11y/accessible-emoji",
  "jsx-a11y/label-has-for",
  "jsx-a11y/no-onchange",
  // Opinionada (prefiere etiquetas sobre role) y no está en el preset.
  "jsx-a11y/prefer-tag-over-role",
];
