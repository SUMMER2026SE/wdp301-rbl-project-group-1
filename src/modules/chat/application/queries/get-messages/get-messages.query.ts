export interface GetMessagesParams {
  conversationId: string;
  page: number;
  limit: number;
  skip: number;
}

export class GetMessagesQuery {
  constructor(public readonly params: GetMessagesParams) {}
}
