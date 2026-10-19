export function Lista({ opcionActiva }: { opcionActiva: string }) {
  return (
    <div role="listbox" tabIndex={0} aria-activedescendant={opcionActiva}>
      <div role="option" id="op-1" aria-selected="false">Uno</div>
    </div>
  );
}
