export abstract class BaseEntity<TId> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  equals(other: BaseEntity<TId>): boolean {
    if (!(other instanceof BaseEntity)) return false;
    if (other === this) return true;
    return JSON.stringify(this._id) === JSON.stringify(other._id);
  }
}
