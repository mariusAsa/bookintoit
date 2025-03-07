// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace;
			};
			context: {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
