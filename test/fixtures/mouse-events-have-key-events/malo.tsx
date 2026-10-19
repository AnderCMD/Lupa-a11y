export function Ayuda({ mostrar }: { mostrar: () => void }) {
  return (
    <button type="button" onMouseOver={mostrar}>
      ?
    </button>
  );
}
