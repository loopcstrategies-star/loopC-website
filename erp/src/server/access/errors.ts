export class AccessError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AccessError";
    this.code = code;
  }
}
