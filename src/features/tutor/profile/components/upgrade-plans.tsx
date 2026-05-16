import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";
import {
    ArrowUpCircle,
    Award,
    Medal,
    Gem,
    Check,
    Lock,
    CheckCircle2,
    AlertTriangle,
    XCircle,
} from "lucide-react";

interface PlanFeature {
    text: string;
    included: boolean;
    warning?: boolean;
}

interface UpgradePlan {
    id: string;
    name: string;
    price: number;
    period: string;
    cta: string;
    badge?: string;
    badgeColor?: "yellow" | "blue" | "green";
    features: PlanFeature[];
    isPrimary?: boolean;
}

interface UpgradePlansProps {
    plans: UpgradePlan[];
}

export function UpgradePlans({ plans }: UpgradePlansProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 px-1">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ArrowUpCircle className="size-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                    Nâng cấp Tài khoản
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`p-6 flex flex-col h-full transition-all duration-300 bg-card/50 backdrop-blur-sm border-border relative overflow-hidden group hover:shadow-xl ${plan.isPrimary
                            ? "ring-2 ring-primary shadow-lg shadow-primary/5"
                            : "hover:-translate-y-1 shadow-sm"
                            }`}
                    >
                        {plan.isPrimary && (
                            <div className="absolute top-0 right-0">
                                <div className="bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-6 py-0.5 rotate-45 translate-x-[20px] translate-y-[8px] shadow-sm">
                                    Best
                                </div>
                            </div>
                        )}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3
                                    className={`text-[10px] font-black uppercase tracking-[0.2em] ${plan.isPrimary ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    {plan.name}
                                </h3>
                                {plan.badge && (
                                    <Badge
                                        className={`${plan.badgeColor === "blue" ? "bg-muted text-foreground" : plan.badgeColor === "yellow" ? "bg-warning-soft text-warning-foreground" : "bg-success-soft text-success-foreground"} flex items-center gap-1 px-2 py-0.5 text-[10px] border-none shadow-none`}
                                    >
                                        {plan.id === "standard" ? (
                                            <Award className="size-3" />
                                        ) : plan.id === "premium" ? (
                                            <Medal className="size-3" />
                                        ) : (
                                            <Gem className="size-3" />
                                        )}
                                        {plan.badge}
                                    </Badge>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-foreground tracking-tighter">
                                    {plan.price.toLocaleString("vi-VN")}đ
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                                    /{plan.period}
                                </span>
                            </div>
                        </div>

                        <Button
                            className={`w-full mb-6 py-5 text-sm font-bold transition-all ${plan.isPrimary
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.01]"
                                : plan.id === "standard"
                                    ? "bg-muted hover:bg-accent text-foreground cursor-not-allowed"
                                    : "bg-muted/50 text-muted-foreground cursor-not-allowed border-dashed border"
                                }`}
                            disabled={!plan.isPrimary && plan.id !== "standard"}
                        >
                            {plan.id === "premium" && <Check className="size-3.5 mr-1.5" />}
                            {plan.id === "elite" && <Lock className="size-3.5 mr-1.5" />}
                            {plan.cta}
                        </Button>

                        {/* Features */}
                        <div className="space-y-4 flex-1 border-t border-border/50 pt-4">
                            <div className="space-y-2.5">
                                {plan.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="text-[13px] font-medium leading-tight flex items-start gap-2.5"
                                    >
                                        <div
                                            className={`shrink-0 mt-0.5 ${plan.isPrimary
                                                ? feature.included
                                                    ? "text-primary"
                                                    : "text-muted-foreground/30"
                                                : feature.included
                                                    ? "text-success"
                                                    : feature.warning
                                                        ? "text-warning"
                                                        : "text-muted-foreground/30"
                                                }`}
                                        >
                                            {feature.included ? (
                                                <CheckCircle2 className="size-3.5" />
                                            ) : feature.warning ? (
                                                <AlertTriangle className="size-3.5" />
                                            ) : (
                                                <XCircle className="size-3.5" />
                                            )}
                                        </div>
                                        <span
                                            className={
                                                feature.included
                                                    ? "text-foreground/80"
                                                    : "text-muted-foreground/50 italic"
                                            }
                                        >
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {plan.isPrimary && (
                                <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Award className="size-3" /> Quyền lợi đi kèm
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            "Ưu tiên hiển thị trang 1-3",
                                            "Phí dịch vụ giảm còn 15%",
                                            "Thư viện học liệu & Support 24/7",
                                        ].map((text, idx) => (
                                            <div
                                                key={idx}
                                                className="text-[11px] font-bold text-primary/80 flex items-center gap-2"
                                            >
                                                <div className="size-1 rounded-full bg-primary" />
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
