# EventBank Accounts micro-frontend

The accounts screens of [EventBank](https://github.com/marcelo-roman/eventbank-platform): the account list, opening an account, deposits, withdrawals and closing. The account page puts the statement (the read model) next to the event stream (the write model), and a slider replays the account to any version by asking the Accounts service to fold the stream up to that point.

After each command the page waits until the read model reaches the version the command returned, and tells how long the projection took to catch up.

It is a [Module Federation](https://module-federation.io) remote of [eventbank-shell](https://github.com/marcelo-roman/eventbank-shell): it exposes `./App`, which the shell mounts at `/accounts`. It ships with its own query client and its own styles, and uses the shell's theme for everything shared.

## Running

```bash
pnpm install
pnpm dev          # http://localhost:5174, standalone, API proxied to the gateway on :5100
pnpm build        # dist/remoteEntry.js is what the shell loads
pnpm test
```

Standalone, the page links the theme from the shell dev server at `http://localhost:5173/theme.css`, so start the shell too for the full look. To run everything at once, use [eventbank-platform](https://github.com/marcelo-roman/eventbank-platform).

## License

[MIT](LICENSE)
