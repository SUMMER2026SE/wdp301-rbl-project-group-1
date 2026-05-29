import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { PaymentReferenceType } from 'src/shared/domain/enums/enums';

export const CreatePaymentSchema = z
  .object({
    referenceType: z.nativeEnum(PaymentReferenceType).meta({
      example: PaymentReferenceType.TUTOR_BOOKING,
      description: 'The reference type for the payment',
    }),
    referenceId: z.string().meta({
      example: 'enrollment-id-123',
      description: 'The ID of the reference entity',
    }),
    amount: z.number().positive().meta({
      example: 500000,
      description: 'Payment amount',
    }),
    returnUrl: z.string().url().meta({
      example: 'http://localhost:3000/payment/success',
      description: 'URL to return to after successful payment',
    }),
    cancelUrl: z.string().url().meta({
      example: 'http://localhost:3000/payment/cancel',
      description: 'URL to return to if payment is cancelled',
    }),
  })
  .meta({ id: 'CreatePaymentDto' });

export class CreatePaymentDto extends createZodDto(CreatePaymentSchema) {}
