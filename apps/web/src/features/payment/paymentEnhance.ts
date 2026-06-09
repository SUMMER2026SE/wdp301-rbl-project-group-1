import { 
  paymentApi as originalPaymentApi,
  PaymentControllerCreatePaymentApiResponse,
  CreatePaymentDto as OriginalCreatePaymentDto
} from "./paymentApi";

type CreatePaymentDto = Omit<OriginalCreatePaymentDto, 'referenceType'> & {
  referenceType: "TUTOR_BOOKING" | "COURSE_ENROLLMENT";
};

export const paymentApi = originalPaymentApi.enhanceEndpoints({
  addTagTypes: ["Payment"],
  endpoints: {
    paymentControllerCreatePayment: {
      invalidatesTags: ["Payment"],
    },
    webhookControllerHandleWebhook: {
      invalidatesTags: ["Payment"],
    },
  },
}).injectEndpoints({
  endpoints: (build) => ({
    paymentControllerCreatePayment: build.mutation<
      PaymentControllerCreatePaymentApiResponse,
      { createPaymentDto: CreatePaymentDto }
    >({
      query: (queryArg) => ({
        url: `/api/payments`,
        method: "POST",
        body: queryArg.createPaymentDto,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  usePaymentControllerCreatePaymentMutation,
  useWebhookControllerHandleWebhookMutation,
  useMockPaymentControllerMockCheckoutQuery,
} = paymentApi;
