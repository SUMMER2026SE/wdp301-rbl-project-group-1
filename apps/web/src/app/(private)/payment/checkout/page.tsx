import { OrderSummary } from "@/src/features/payment/components/order-summary";
import { PaymentMethods } from "@/src/features/payment/components/payment-methods";
import { redirect } from "next/navigation";

interface CheckoutPageProps {
  searchParams: Promise<{
    enrollmentId?: string;
    amount?: string;
    courseTitle?: string;
    courseSubject?: string;
    tutorName?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const { enrollmentId, amount, courseTitle, courseSubject, tutorName } = params;

  // Guard — nếu không có context hợp lệ thì về trang courses
  if (!enrollmentId || !amount || !courseTitle) {
    redirect("/student/courses");
  }

  const parsedAmount = Number(amount);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-6 md:px-12 md:py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground font-heading">
          Thanh toán
        </h1>
        <p className="text-muted-foreground mt-1">
          Chọn phương thức thanh toán phù hợp với bạn.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <OrderSummary
          courseTitle={courseTitle}
          courseSubject={courseSubject ?? "Khóa học"}
          tutorName={tutorName ?? "Gia sư"}
          amount={parsedAmount}
        />
        <PaymentMethods enrollmentId={enrollmentId} amount={parsedAmount} />
      </div>
    </main>
  );
}
