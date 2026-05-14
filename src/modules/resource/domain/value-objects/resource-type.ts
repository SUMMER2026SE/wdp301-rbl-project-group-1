export type ResourceTypeValue = 'FILE' | 'VIDEO' | 'LINK' | 'DOCUMENT';

export class ResourceType {
  private readonly value: ResourceTypeValue;

  private constructor(value: ResourceTypeValue) {
    this.value = value;
  }

  static create(value: string): ResourceType {
    const validTypes: ResourceTypeValue[] = [
      'FILE',
      'VIDEO',
      'LINK',
      'DOCUMENT',
    ];
    if (!validTypes.includes(value as ResourceTypeValue)) {
      throw new Error(`Invalid ResourceType: ${value}`);
    }
    return new ResourceType(value as ResourceTypeValue);
  }

  getValue(): ResourceTypeValue {
    return this.value;
  }
}
