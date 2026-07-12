import type { Client } from '../client/Client.js';

/** Base class for every data structure. Holds a non-enumerable reference to the client. */
export abstract class Base<Data = unknown> {
  public readonly client: Client;
  /** The raw payload from the Telegram API. Every field is accessible here, snake_cased. */
  public raw: Data;

  public constructor(client: Client, data: Data) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false });
    this.client = client;
    this.raw = data;
  }

  /** Merge new raw data into this structure (used when an entity is re-fetched). */
  protected _patch(data: Data): this {
    this.raw = data;
    return this;
  }
}
