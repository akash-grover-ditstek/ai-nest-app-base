export interface ErrorLike {
  status?: number;
  message?: string;
  name?: string;
  stack?: string;
  [key: string]: unknown;
}
