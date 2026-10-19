export function Demo() {
  return (
    <video src="/demo.mp4" controls>
      <track kind="captions" src="/demo-es.vtt" srcLang="es" label="Español" />
    </video>
  );
}
