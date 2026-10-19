export function Guardar({ guardar }: { guardar: () => void }) {
  return (
    <button type="button" onClick={guardar}>
      Guardar
    </button>
  );
}
