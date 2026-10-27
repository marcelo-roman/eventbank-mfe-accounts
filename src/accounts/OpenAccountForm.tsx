import { type SyntheticEvent, useState } from 'react';
import { Link } from 'react-router';
import { CatchUpNote } from '../shared/CatchUpNote';
import { ErrorMessage } from '../shared/ErrorMessage';
import { useLocale } from '../shared/i18n/LocaleContext';
import { useOpenAccount } from './api';

const currencies = ['BRL', 'USD', 'EUR'];

export function OpenAccountForm() {
  const { t } = useLocale();
  const [currency, setCurrency] = useState('USD');
  const openAccount = useOpenAccount();

  const submit = (event: SyntheticEvent) => {
    event.preventDefault();
    openAccount.mutate({ currency });
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>{t.openAccount.title}</h2>
      <p className="muted">{t.openAccount.note}</p>
      <label className="field">
        <span>{t.openAccount.currency}</span>
        <select
          value={currency}
          onChange={(event) => {
            setCurrency(event.target.value);
          }}
        >
          {currencies.map((code) => (
            <option key={code}>{code}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="button primary" disabled={openAccount.isPending}>
        {openAccount.isPending ? t.openAccount.opening : t.openAccount.submit}
      </button>
      <ErrorMessage error={openAccount.error} />
      {openAccount.data && (
        <div className="success">
          <CatchUpNote catchUp={openAccount.data.catchUp} />
          <Link to={`/accounts/${openAccount.data.result.id}`}>{t.openAccount.viewNew}</Link>
        </div>
      )}
    </form>
  );
}
