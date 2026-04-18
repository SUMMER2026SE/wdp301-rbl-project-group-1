export class ChangeAvatarCommand {
  constructor(
    public readonly userId: string,
    public readonly fileBuffer: Buffer,
    public readonly mimeType: string,
  ) {}
}
