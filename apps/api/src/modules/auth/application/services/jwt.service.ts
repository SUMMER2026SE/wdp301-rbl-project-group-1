export const IJwtService = Symbol('IJwtService');

export interface IJwtService {
  sign(payload: Record<string, unknown>): Promise<string>;
  verify<T extends object = Record<string, unknown>>(token: string): Promise<T>;

  signRefresh(payload: Record<string, unknown>): Promise<string>;
  verifyRefresh<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T>;

  signReset(payload: Record<string, unknown>): Promise<string>;
  verifyReset<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T>;
}

export type JwtServicePort = Pick<
  IJwtService,
  'sign' | 'signRefresh' | 'verifyRefresh' | 'signReset' | 'verifyReset'
>;
