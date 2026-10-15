import { useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney, formatTime } from '../shared/format';
import { type StoredEvent } from '../shared/types';
import { useAccountEvents, useAccountState } from './api';

export function EventStream({ accountId, currency }: { accountId: string; currency: string }) {
  const events = useAccountEvents(accountId);
  const [pinned, setPinned] = useState<number | null>(null);
  const latest = events.data?.at(-1)?.version ?? 0;
  const version = pinned ?? latest;
  const state = useAccountState(accountId, version);

  return (
    <section className="panel side side-write" aria-labelledby="stream-title">
      <header className="side-header">
        <h2 id="stream-title">Event stream</h2>
        <span className="side-tag">Write model</span>
      </header>
      <p className="side-note">The source of truth: append-only facts. Drag to replay the account to any version.</p>
      <ErrorMessage error={events.error} />
      {latest > 0 && (
        <div className="replay">
          <label className="replay-control">
            <span>
              Replay to version <strong>{version}</strong> of {latest}
            </span>
            <input
              type="range"
              min={1}
              max={latest}
              value={version}
              onChange={(event) => {
                setPinned(Number(event.target.value));
              }}
            />
          </label>
          {state.data && (
            <p className="replay-result" aria-live="polite">
              Balance then <strong>{formatMoney(state.data.balance, currency)}</strong>,{' '}
              {state.data.status.toLowerCase()}
            </p>
          )}
          {pinned !== null && pinned !== latest && (
            <button
              type="button"
              className="button quiet small"
              onClick={() => {
                setPinned(null);
              }}
            >
              Back to now
            </button>
          )}
        </div>
      )}
      <ol className="stream">
        {events.data?.map((event) => (
          <EventItem key={event.eventId} event={event} replayed={event.version <= version} />
        ))}
      </ol>
    </section>
  );
}

function EventItem({ event, replayed }: { event: StoredEvent; replayed: boolean }) {
  const payload = Object.fromEntries(Object.entries(event.data).filter(([key]) => key !== 'accountId'));
  return (
    <li className={replayed ? 'stream-event' : 'stream-event future'}>
      <div className="stream-event-head">
        <span className="stream-version">v{event.version}</span>
        <span className="stream-type">{event.type}</span>
        <time dateTime={event.recordedAt}>{formatTime(event.recordedAt)}</time>
      </div>
      {Object.keys(payload).length > 0 && <pre className="payload">{JSON.stringify(payload, null, 2)}</pre>}
    </li>
  );
}
