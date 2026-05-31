export type UserAvailabilityProps = {
  id?: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserAvailability {
  readonly id?: string;
  readonly userId: string;
  readonly dayOfWeek: number;
  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: UserAvailabilityProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.dayOfWeek = props.dayOfWeek;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
