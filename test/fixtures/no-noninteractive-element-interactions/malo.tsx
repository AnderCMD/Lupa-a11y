export function Opcion({ seleccionar }: { seleccionar: () => void }) {
  return <li onClick={seleccionar}>Opción 1</li>;
}
