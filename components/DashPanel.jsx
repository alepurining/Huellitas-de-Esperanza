export default function DashPanel({ children, className = "" }) {
  return (
    <section className={`rounded-panel bg-surface p-[25px] shadow-soft ${className}`}>{children}</section>
  );
}
