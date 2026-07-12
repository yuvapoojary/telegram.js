// Client + transports
export { Client, type ClientOptions } from './client/Client.js';
export { PollingClient, type PollingOptions } from './client/PollingClient.js';
export { WebhookClient, type WebhookServerOptions } from './client/WebhookClient.js';

// Events
export type { ClientEvents } from './events/ClientEvents.js';

// Structures
export * from './structures/index.js';

// Re-exported companion packages (batteries-included, like discord.js).
export * from '@telegramxjs/rest';
export * from '@telegramxjs/builders';

// Generated core: every Bot API type + method signature, and version metadata.
export type * as Telegram from '@telegramxjs/types';
export { METHOD_FILE_FIELDS, API_VERSION, API_RELEASE_DATE, METHOD_NAMES, TYPE_NAMES } from '@telegramxjs/types';
export type { ApiMethods } from '@telegramxjs/types';
