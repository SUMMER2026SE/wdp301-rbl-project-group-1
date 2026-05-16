import { createZodDto } from 'nestjs-zod';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const StudentDataSchema = z
  .object({
    school: z.string().optional().meta({
      example: 'Hanoi High School',
      description: 'School name (optional)',
    }),
    learningGoal: z.string().optional().meta({
      example: 'Pass university entrance exam',
      description: 'Learning goal (optional)',
    }),
    subjectIds: z
      .array(z.string())
      .min(1)
      .meta({
        example: ['subjectId1', 'subjectId2'],
        description: 'List of subject IDs the student is interested in',
      }),
    gradeIds: z
      .array(z.string())
      .min(1)
      .meta({
        example: ['gradeId1'],
        description: 'List of grade IDs for the student',
      }),
  })
  .meta({ id: 'StudentRegisterData' });

export const RegisterSchema = z
  .object({
    email: z.string().email().meta({
      example: 'user@example.com',
      description: 'The email of the user',
    }),
    password: z.string().min(8).meta({
      example: 'password123',
      description: 'The password of the user',
    }),
    role: z.nativeEnum(UserRole).meta({
      example: UserRole.STUDENT,
      description: 'The role of the user',
    }),
    nickname: z.string().min(1).meta({
      example: 'Tu VN',
      description: 'The nickname of the user',
    }),
    phone: z.string().min(1).meta({
      example: '+1234567890',
      description: 'Phone number',
    }),
    dateOfBirth: z.string().date().meta({
      example: '1990-01-01',
      description: 'Date of birth',
    }),
    studentData: StudentDataSchema.optional().meta({
      description: 'Required when role is STUDENT',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.role === UserRole.STUDENT && !data.studentData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['studentData'],
        message: 'studentData is required when role is STUDENT',
      });
    }
  })
  .meta({ id: 'RegisterDto' });

export class RegisterDto extends createZodDto(RegisterSchema) {}
