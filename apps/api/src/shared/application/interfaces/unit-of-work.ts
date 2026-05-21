export const IUnitOfWork = Symbol('IUnitOfWork');

export interface IUnitOfWork {
  execute<T>(work: () => Promise<T>): Promise<T>;
}
