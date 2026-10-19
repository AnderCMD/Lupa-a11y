export function Opcion({ seleccionar }: { seleccionar: () => void }) {
  return (
    <li>
      <button type="button" onClick={seleccionar}>
        Opción 1
      </button>
    </li>
  );
}
