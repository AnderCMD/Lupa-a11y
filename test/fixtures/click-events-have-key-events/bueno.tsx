export function Menu({ abrirMenu }: { abrirMenu: () => void }) {
  return (
    <button type="button" onClick={abrirMenu}>
      Menú
    </button>
  );
}
