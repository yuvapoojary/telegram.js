import type { ResponseParameters } from '@telegramxjs/types';

/**
 * Thrown when the Telegram Bot API responds with `ok: false`. Exposes the numeric
 * `error_code`, the human-readable `description`, and any `parameters` Telegram
 * returned (e.g. `retry_after`, `migrate_to_chat_id`).
 */
export class TelegramError extends Error {
  /** The Bot API method that was called (e.g. `sendMessage`). */
  public readonly method: string;
  /** Telegram's numeric error code (mirrors the HTTP status in most cases). */
  public readonly code: number;
  /** Extra machine-readable information about the error, when present. */
  public readonly parameters?: ResponseParameters;

  public constructor(method: string, code: number, description: string, parameters?: ResponseParameters) {
    super(description);
    this.name = 'TelegramError';
    this.method = method;
    this.code = code;
    this.parameters = parameters;
  }

  /** Seconds to wait before retrying, when Telegram rate-limits the request (HTTP 429). */
  public get retryAfter(): number | undefined {
    return this.parameters?.retry_after;
  }
}

/** Thrown for transport-level failures (network errors, timeouts, non-JSON responses). */
export class HTTPError extends Error {
  public readonly method: string;
  public readonly status?: number;

  public constructor(method: string, message: string, status?: number) {
    super(message);
    this.name = 'HTTPError';
    this.method = method;
    this.status = status;
  }
}
