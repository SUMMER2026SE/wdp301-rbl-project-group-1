export const IMessageBroker = Symbol('IMessageBroker');

export interface IMessageBroker {
  publishEvent(pattern: string, data: any): Promise<void>;
  sendMessage<TResult = any, TInput = any>(
    pattern: string,
    data: TInput,
  ): Promise<TResult>;
}
