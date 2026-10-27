import Link from 'next/link';

export type Crumb = [label: string, href?: string];

// Migas de pan: el último elemento es la página actual.
export default function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan">
      <ol className="crumbs">
        {items.map(([label, href], i) => (
          <li key={label + i}>
            {i === items.length - 1 ? <span aria-current="page">{label}</span> : href ? <Link href={href}>{label}</Link> : <span>{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
