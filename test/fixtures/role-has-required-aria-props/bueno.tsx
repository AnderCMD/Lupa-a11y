export function Terminos({ aceptado }: { aceptado: boolean }) {
  return (
    <div role="checkbox" tabIndex={0} aria-checked={aceptado}>
      Acepto los términos
    </div>
  );
}
