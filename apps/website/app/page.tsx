import Link from 'next/link';
import { API_VERSION } from '@telegramxjs/types';

const features = [
  ['100% API coverage', `Every method and type is generated from the official spec. Currently tracks ${API_VERSION}.`],
  ['First-class TypeScript', 'Full types for every method, parameter, and object, with editor autocomplete everywhere.'],
  ['Ergonomic OO layer', 'A familiar discord.js-style Client, events, and structures over a typed raw core.'],
  ['Modern runtime', 'Native fetch/FormData, dual ESM + CommonJS, Node ≥ 18, zero heavy dependencies.'],
];

export default function Home() {
  return (
    <div className="py-16">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          telegram<span className="text-brand">.js</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          A powerful, fully-typed Node.js library for the Telegram Bot API, inspired by discord.js.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/docs/"
            className="rounded-md bg-brand px-5 py-2.5 font-medium text-white no-underline hover:bg-brand-dark"
          >
            Read the docs
          </Link>
          <code className="rounded-md bg-zinc-100 px-4 py-2.5 dark:bg-zinc-900">npm install telegramxjs</code>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
        {features.map(([title, body]) => (
          <div key={title} className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
