export abstract class IJwtService {
  abstract sign(payload: Record<string, unknown>): Promise<string>;
  abstract verify<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T>;

  abstract signRefresh(payload: Record<string, unknown>): Promise<string>;
  abstract verifyRefresh<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T>;
}

export type JwtServicePort = Pick<
  IJwtService,
  'sign' | 'signRefresh' | 'verifyRefresh'
>;
