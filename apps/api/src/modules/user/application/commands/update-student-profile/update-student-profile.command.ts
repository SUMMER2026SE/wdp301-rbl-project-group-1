import { ICommand } from '@nestjs/cqrs';

export class UpdateStudentProfileCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly data: {
      school?: string | null;
      learningGoal?: string | null;
      gradeIds?: string[];
      subjectIds?: string[];
    },
  ) {}
}
