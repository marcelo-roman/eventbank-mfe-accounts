# EventBank accounts micro-frontend

The account screens of [EventBank](https://github.com/marcelo-roman/eventbank-platform): the customer's accounts with branch and number, opening another account in another currency, and the account page that puts the statement (the read model) next to the event stream (the write model), with a slider that replays the account to any version. Only the owner sees the deposit, withdraw and close actions; operators get the same page read-only.

It is a [Module Federation](https://module-federation.io) remote of [eventbank-shell](https://github.com/marcelo-roman/eventbank-shell): it exposes `./App`, which the shell mounts at `/accounts` and renders with an `auth` prop (the signed-in user and a function that returns a fresh access token). Every API call sends that token. It ships with its own query client and styles, and uses the shell's theme for everything shared.

## Running

```bash
pnpm install
pnpm dev          # http://localhost:5174, standalone, API proxied to the gateway on :5100
pnpm build        # dist/remoteEntry.js is what the shell loads
pnpm test
```

Standalone, the app reads an access token from `localStorage["eventbank.devToken"]` and links the theme from the shell dev server at `http://localhost:5173/theme.css`. To run everything together, with sign-in, use [eventbank-platform](https://github.com/marcelo-roman/eventbank-platform).

## License

[MIT](LICENSE)
