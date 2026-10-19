export function Detalles({ abrirDetalles }: { abrirDetalles: () => void }) {
  return (
    <button type="button" onClick={abrirDetalles}>
      Ver detalles
    </button>
  );
}
