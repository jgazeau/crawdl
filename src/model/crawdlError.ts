export class CrawdlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CrawdlError';
  }
}
