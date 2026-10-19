export function Cerrar({ cerrar }: { cerrar: () => void }) {
  return (
    <button type="button" onClick={cerrar} aria-label="Cerrar">
      <i className="icono-cerrar" aria-hidden="true" />
    </button>
  );
}
