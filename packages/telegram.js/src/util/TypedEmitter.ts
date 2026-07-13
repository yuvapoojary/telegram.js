import { EventEmitter } from 'node:events';

/** A minimally-typed wrapper over Node's {@link EventEmitter}. */
export class TypedEmitter<Events extends Record<keyof Events, unknown[]>> extends EventEmitter {
  public override on<K extends keyof Events & string>(event: K, listener: (...args: Events[K]) => void): this {
    return super.on(event, listener as (...args: unknown[]) => void);
  }

  public override once<K extends keyof Events & string>(event: K, listener: (...args: Events[K]) => void): this {
    return super.once(event, listener as (...args: unknown[]) => void);
  }

  public override off<K extends keyof Events & string>(event: K, listener: (...args: Events[K]) => void): this {
    return super.off(event, listener as (...args: unknown[]) => void);
  }

  public override emit<K extends keyof Events & string>(event: K, ...args: Events[K]): boolean {
    return super.emit(event, ...args);
  }
}
