import { type CatchUp } from './consistency';

export function CatchUpNote({ catchUp }: { catchUp: CatchUp | undefined }) {
  if (!catchUp) {
    return null;
  }
  return (
    <p className="catch-up" role="status">
      Saved as version {catchUp.version}. The read model caught up {catchUp.milliseconds} ms later.
    </p>
  );
}
