import "server-only";
import { neon } from "@neondatabase/serverless";

/** Lazy init — module-level neon() would crash builds before env exists. */
let _sql: ReturnType<typeof neon> | null = null;

export function sql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("missing server env: DATABASE_URL");
    _sql = neon(url);
  }
  return _sql;
}

/** Repeatable SELECTs used during navigation. A stalled HTTP connection must
 * not hold a page open for the transport's minute-long default. Only reads
 * opt in: writes keep sql() and are never replayed after an ambiguous failure. */
export async function readSql<T>(query: (read: ReturnType<typeof neon>) => PromiseLike<T>): Promise<T> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("missing server env: DATABASE_URL");
  for (let attempt = 0; ; attempt++) {
    const signal = AbortSignal.timeout(2500);
    try {
      return await query(neon(url, { fetchOptions: { signal, cache: "no-store" } }));
    } catch (error) {
      const transportFailure = signal.aborted || (
        error !== null && typeof error === "object" && "sourceError" in error && error.sourceError != null
      );
      if (attempt > 0 || !transportFailure) throw error;
    }
  }
}
