const SYM: Record<string, React.ReactNode> = {
  business: (<><circle cx="8" cy="8" r="6" fill="var(--mint)" stroke="currentColor" strokeWidth="1.5" /><path d="m5.2 8.2 2 2 3.6-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></>),
  editorial: (<><circle cx="8" cy="8" r="6" fill="#fff" stroke="currentColor" strokeWidth="1.5" /><path d="M8 2a6 6 0 0 0 0 12z" fill="var(--mint)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></>),
  external: <circle cx="8" cy="8" r="6" fill="#fff" stroke="currentColor" strokeWidth="1.5" />,
  pending: <circle cx="8" cy="8" r="6" fill="#fff" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.4 2.4" />,
};
const StatusSymbol = ({ status, size = 34 }: { status: string; size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">{SYM[status]}</svg>
);


export default StatusSymbol;
