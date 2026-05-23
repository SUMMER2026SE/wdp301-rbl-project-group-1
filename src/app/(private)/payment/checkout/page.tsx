import { OrderSummary } from "@/src/features/payment/components/order-summary";
import { PaymentMethods } from "@/src/features/payment/components/payment-methods";

export default function CheckoutPage() {
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-6 md:px-12 md:py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <OrderSummary />
        <PaymentMethods />
      </div>
    </main>
  );
}
