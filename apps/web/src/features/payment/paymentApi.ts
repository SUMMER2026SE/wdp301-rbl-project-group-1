import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    paymentControllerCreatePayment: build.mutation<
      PaymentControllerCreatePaymentApiResponse,
      PaymentControllerCreatePaymentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/payments`,
        method: "POST",
        body: queryArg.createPaymentDto,
      }),
    }),
    webhookControllerHandleWebhook: build.mutation<
      WebhookControllerHandleWebhookApiResponse,
      WebhookControllerHandleWebhookApiArg
    >({
      query: () => ({ url: `/api/payments/webhook`, method: "POST" }),
    }),
    mockPaymentControllerMockCheckout: build.query<
      MockPaymentControllerMockCheckoutApiResponse,
      MockPaymentControllerMockCheckoutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/payments/mock/checkout`,
        params: {
          orderCode: queryArg.orderCode,
          amount: queryArg.amount,
          returnUrl: queryArg.returnUrl,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as paymentApi };
export type PaymentControllerCreatePaymentApiResponse = unknown;
export type PaymentControllerCreatePaymentApiArg = {
  createPaymentDto: CreatePaymentDto;
};
export type WebhookControllerHandleWebhookApiResponse = unknown;
export type WebhookControllerHandleWebhookApiArg = void;
export type MockPaymentControllerMockCheckoutApiResponse = unknown;
export type MockPaymentControllerMockCheckoutApiArg = {
  orderCode: string;
  amount: string;
  returnUrl: string;
};
export type CreatePaymentDto = {
  /** The reference type for the payment */
  referenceType: "TUTOR_BOOKING";
  /** The ID of the reference entity */
  referenceId: string;
  /** Payment amount */
  amount: number;
  /** URL to return to after successful payment */
  returnUrl: string;
  /** URL to return to if payment is cancelled */
  cancelUrl: string;
};
export const {
  usePaymentControllerCreatePaymentMutation,
  useWebhookControllerHandleWebhookMutation,
  useMockPaymentControllerMockCheckoutQuery,
} = injectedRtkApi;
