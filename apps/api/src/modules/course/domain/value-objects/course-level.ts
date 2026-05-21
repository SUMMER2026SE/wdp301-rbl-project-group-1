export type CourseLevelType = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export class CourseLevel {
  private readonly value: CourseLevelType;

  private constructor(value: CourseLevelType) {
    this.value = value;
  }

  static create(value: string): CourseLevel {
    const validLevels: CourseLevelType[] = [
      'BEGINNER',
      'INTERMEDIATE',
      'ADVANCED',
    ];
    if (!validLevels.includes(value as CourseLevelType)) {
      throw new Error(`Invalid CourseLevel: ${value}`);
    }
    return new CourseLevel(value as CourseLevelType);
  }

  getValue(): CourseLevelType {
    return this.value;
  }
}
