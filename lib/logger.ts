/**
 * Lightweight structured logger for API routes.
 *
 * - In production (`NODE_ENV === "production"`): outputs structured JSON lines
 *   with `level`, `message`, `timestamp`, and optional data. PII fields
 *   (`ip`, `email`, `clientIp`) are automatically redacted.
 * - In development: delegates to `console.*` for human-readable output.
 *
 * No external dependencies.
 */

type LogLevel = 'info' | 'warn' | 'error'

/** Keys whose values are replaced with "[REDACTED]" in production logs. */
const PII_KEYS: ReadonlySet<string> = new Set(['ip', 'email', 'clientIp', 'name'])

/**
 * Shallow-clone `data` and replace any PII field values with "[REDACTED]".
 * Only top-level keys are checked — this keeps the implementation simple and
 * predictable for the data shapes we actually log.
 */
function redactPii(data: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    redacted[key] = PII_KEYS.has(key) ? '[REDACTED]' : value
  }
  return redacted
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

function log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
  if (isProduction()) {
    const entry: Record<string, unknown> = {
      level,
      message,
      timestamp: new Date().toISOString(),
    }
    if (data) {
      Object.assign(entry, redactPii(data))
    }
    // All structured logs go to stdout/stderr as a single JSON line.
    const output = JSON.stringify(entry)
    if (level === 'error') {
      console.error(output)
    } else if (level === 'warn') {
      console.warn(output)
    } else {
      console.log(output)
    }
  } else {
    // Development: human-readable output
    const prefix = `[${level.toUpperCase()}]`
    if (level === 'error') {
      console.error(prefix, message, data ?? '')
    } else if (level === 'warn') {
      console.warn(prefix, message, data ?? '')
    } else {
      console.log(prefix, message, data ?? '')
    }
  }
}

export const logger = {
  info(message: string, data?: Record<string, unknown>): void {
    log('info', message, data)
  },
  warn(message: string, data?: Record<string, unknown>): void {
    log('warn', message, data)
  },
  error(message: string, data?: Record<string, unknown>): void {
    log('error', message, data)
  },
}
