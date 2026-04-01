export abstract class IJwtService {
  abstract sign(payload: Record<string, unknown>): Promise<string>;
  abstract verify<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T>;
}
