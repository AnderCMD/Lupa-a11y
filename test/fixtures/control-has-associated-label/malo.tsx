export function Cerrar({ cerrar }: { cerrar: () => void }) {
  return (
    <button type="button" onClick={cerrar}>
      <i className="icono-cerrar" />
    </button>
  );
}
