export class AccessError extends Error {
  code: string;
  meta?: Record<string, unknown>;

  constructor(code: string, message: string, meta?: Record<string, unknown>) {
    super(message);
    this.name = "AccessError";
    this.code = code;
    this.meta = meta;
  }
}
