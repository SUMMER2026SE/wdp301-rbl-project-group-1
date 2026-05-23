"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { useState } from "react";
import { BankTransferDetails } from "./bank-transfer-details";
import { PaymentMethodItem } from "./payment-method-item";

type PaymentMethodId = "bank" | "wallet" | "card";

export const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>("bank");

  return (
    <section className="lg:col-span-7 space-y-6">
      <Card className="bg-background p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 font-heading">
          Payment Method
        </h2>
        <div className="space-y-4">
          <PaymentMethodItem
            selected={selectedMethod === "bank"}
            onClick={() => setSelectedMethod("bank")}
            icon="account_balance"
            title="Bank Transfer (VietQR)"
            subtitle="Instant confirmation with QR scan"
          >
            <BankTransferDetails />
          </PaymentMethodItem>

          <PaymentMethodItem
            selected={selectedMethod === "wallet"}
            onClick={() => setSelectedMethod("wallet")}
            icon="account_balance_wallet"
            iconBgClassName="bg-amber-500/10"
            iconColorClassName="text-amber-600"
            title="E-Wallet (MoMo, ZaloPay)"
            subtitle="Fast & secure mobile payment"
          />

          <PaymentMethodItem
            selected={selectedMethod === "card"}
            onClick={() => setSelectedMethod("card")}
            icon="credit_card"
            iconBgClassName="bg-blue-500/10"
            iconColorClassName="text-blue-600"
            title="Credit / Debit Card"
            subtitle="Visa, Mastercard, JCB"
          >
            <div className="mt-4 bg-muted/30 p-4 rounded-lg border border-border/50 animate-in fade-in zoom-in-95 duration-200 text-sm text-muted-foreground text-center">
              Credit card form fields would appear here.
            </div>
          </PaymentMethodItem>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-4">
            By clicking &quot;Complete Payment&quot;, you agree to our{" "}
            <a
              href="#"
              className="text-primary hover:underline hover:decoration-primary/30"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-primary hover:underline hover:decoration-primary/30"
            >
              Refund Policy
            </a>
            .
          </p>
          <Button
            size="lg"
            className="w-full text-base py-6 h-auto font-bold gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            Complete Payment
          </Button>
        </div>
      </Card>
    </section>
  );
};
