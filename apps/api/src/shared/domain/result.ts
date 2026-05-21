export class Result<T> {
  readonly isSuccess: boolean;
  readonly isFailure: boolean;
  readonly error: string | null;
  private readonly _value: T | null;

  private constructor(
    isSuccess: boolean,
    error: string | null,
    value: T | null,
  ) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error(
        `Cannot get value of a failed result. Error: ${this.error ?? 'Unknown'}`,
      );
    }
    return this._value as T;
  }

  static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value ?? null);
  }

  static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error, null);
  }

  static combine(results: Result<unknown>[]): Result<void> {
    for (const result of results) {
      if (result.isFailure) return Result.fail(result.error ?? 'Unknown error');
    }
    return Result.ok();
  }
}
