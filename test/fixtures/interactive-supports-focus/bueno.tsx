export function Menu({ abrirMenu }: { abrirMenu: () => void }) {
  const alPulsarTecla = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") abrirMenu();
  };
  return (
    <div role="button" tabIndex={0} onClick={abrirMenu} onKeyDown={alPulsarTecla}>
      Menú
    </div>
  );
}
