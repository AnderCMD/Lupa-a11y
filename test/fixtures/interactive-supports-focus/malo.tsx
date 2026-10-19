export function Menu({ abrirMenu }: { abrirMenu: () => void }) {
  return (
    <div role="button" onClick={abrirMenu}>
      Menú
    </div>
  );
}
