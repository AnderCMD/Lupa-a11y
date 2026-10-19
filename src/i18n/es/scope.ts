import type { RuleExplanation } from "../types";

export const scope: RuleExplanation = {
  ruleId: "jsx-a11y/scope",
  titulo: "scope fuera de un <th>",
  mensaje: "El atributo scope solo se usa en <th>: cambia este elemento a <th> o quítalo.",
  porQueImporta:
    "scope le dice al lector de pantalla si un encabezado de tabla aplica a una columna o a una fila. En una celda normal no significa nada y la tabla se vuelve más difícil de entender.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<td scope="col">Nombre</td>`,
  bienEjemplo: `<th scope="col">Nombre</th>`,
  notaExtra: 'Usa <th> para las celdas de encabezado, con scope="col" o scope="row".',
  wcag: {
    criterio: "1.3.1 Información y relaciones",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
  },
  docsUrl: "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/scope.md",
};
