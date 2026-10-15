import { type SyntheticEvent, useState } from 'react';
import { Link } from 'react-router';
import { CatchUpNote } from '../shared/CatchUpNote';
import { ErrorMessage } from '../shared/ErrorMessage';
import { useOpenAccount } from './api';

const currencies = ['BRL', 'USD', 'EUR'];

export function OpenAccountForm() {
  const [holder, setHolder] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const openAccount = useOpenAccount();

  const submit = (event: SyntheticEvent) => {
    event.preventDefault();
    openAccount.mutate(
      { holder, currency },
      {
        onSuccess: () => {
          setHolder('');
        },
      },
    );
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Open an account</h2>
      <label className="field">
        <span>Holder name</span>
        <input
          value={holder}
          onChange={(event) => {
            setHolder(event.target.value);
          }}
          placeholder="Ana Ribeiro"
          required
        />
      </label>
      <label className="field">
        <span>Currency</span>
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
        {openAccount.isPending ? 'Opening…' : 'Open account'}
      </button>
      <ErrorMessage error={openAccount.error} />
      {openAccount.data && (
        <div className="success">
          <CatchUpNote catchUp={openAccount.data.catchUp} />
          <Link to={`/accounts/${openAccount.data.result.id}`}>View the new account</Link>
        </div>
      )}
    </form>
  );
}
