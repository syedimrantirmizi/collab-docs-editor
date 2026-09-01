export class ImportError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ImportError";
    this.code = code;
  }
}
