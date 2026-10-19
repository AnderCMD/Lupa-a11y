import type { RuleExplanation } from "../types";

export const mediaHasCaption: RuleExplanation = {
  ruleId: "jsx-a11y/media-has-caption",
  titulo: "Video o audio sin subtítulos",
  mensaje: 'Este elemento multimedia necesita un <track kind="captions"> con subtítulos.',
  porQueImporta:
    "Las personas sordas o con baja audición no pueden oír lo que se dice. Los subtítulos también ayudan a quien ve el video sin sonido o en un lugar ruidoso.",
  afectados: [
    "Personas sordas o con baja audición",
    "Quien ve contenido sin sonido",
    "Quien no domina el idioma hablado",
  ],
  malEjemplo: `<video src="/demo.mp4" controls />`,
  bienEjemplo: `<video src="/demo.mp4" controls>
  <track kind="captions" src="/demo-es.vtt" srcLang="es" label="Español" />
</video>`,
  notaExtra:
    "Vale para <video> y <audio>. Si el video no tiene sonido, agrega muted y la regla no se aplica. Ojo: la regla comprueba que exista el <track>, no que los subtítulos sean correctos.",
  wcag: {
    criterio: "1.2.2 Subtítulos (grabados)",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/media-has-caption.md",
};
