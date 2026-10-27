import { type CatchUp } from './consistency';
import { useLocale } from './i18n/LocaleContext';

export function CatchUpNote({ catchUp }: { catchUp: CatchUp | undefined }) {
  const { t } = useLocale();
  if (!catchUp) {
    return null;
  }
  return (
    <p className="catch-up" role="status">
      {t.catchUp(catchUp.version, catchUp.milliseconds)}
    </p>
  );
}
