export default function PanelHeading({ titulo, subtitulo, children }) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="font-display text-2xl leading-[1.2] text-ink">{titulo}</h2>
        {subtitulo ? <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">{subtitulo}</p> : null}
      </div>
      {children}
    </div>
  );
}
