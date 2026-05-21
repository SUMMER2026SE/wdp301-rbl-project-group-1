export type Async<T> = Promise<T>;

export interface ICommand<TRequest, TResponse = void> {
  execute(command: TRequest): Async<TResponse>;
}

export interface IQuery<TRequest, TResponse> {
  execute(query: TRequest): Async<TResponse>;
}
