import { Button } from "@/src/shared/components/ui/button";

export default function CTA({ id = "cta" }: { id?: string }) {
    return (
        <section id={id} className="w-full py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
                    <div className="absolute inset-0 opacity-10 [background-size:16px_16px] bg-[radial-gradient(#fff_1px,transparent_1px)]" />
                    <div className="relative z-10 mx-auto max-w-2xl">
                        <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl">
                            Sẵn sàng nâng cao điểm số của bạn?
                        </h2>
                        <p className="mb-8 text-lg text-primary-foreground/80">
                            Tham gia cùng hàng ngàn học sinh đã thay đổi hành trình học tập của mình với Edura.
                        </p>
                        <Button className="bg-white px-8 py-3 font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-slate-50">
                            Bắt đầu ngay bây giờ
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}