import { STATUS, type Status } from '@/lib/data';

export default function StatusLabel({ status }: { status: Status }) {
  return <span className={`status s-${status}`}>{STATUS[status].t}</span>;
}
