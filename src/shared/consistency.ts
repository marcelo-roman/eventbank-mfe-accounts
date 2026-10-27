import { ApiError } from './api';

const pollInterval = 100;
const timeout = 8000;

export interface CatchUp {
  version: number;
  milliseconds: number;
}

export async function waitForReadModel(
  read: () => Promise<{ version: number } | null>,
  version: number,
): Promise<CatchUp> {
  const started = performance.now();
  while (performance.now() - started < timeout) {
    const current = await read();
    if (current && current.version >= version) {
      return { version, milliseconds: Math.round(performance.now() - started) };
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }
  throw new ApiError(504, undefined, 'read_model_lagging');
}
