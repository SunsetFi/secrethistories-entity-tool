// TODO: Receive a trace context of what we are working with and report it in the error message.

export function ensure(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function fail(message: string): never {
  throw new Error(message);
}
