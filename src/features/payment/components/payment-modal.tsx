import Modal from "@/src/shared/components/molecules/modal/modal";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { Label } from "@/src/shared/components/ui/label";
import { Separator } from "@/src/shared/components/ui/separator";
import Image from "next/image";

import type { ReactNode } from "react";

interface PaymentModalProps {
  trigger?: ReactNode;
}

const PaymentModal = ({ trigger }: PaymentModalProps) => {
  return (
    <Modal
      trigger={trigger}
      title="Confirm Registration"
      description="Review your course details and preferred shift before proceeding."
      confirmText="Proceed to Payment"
      cancelText="Save for Later"
    >
      <div className="space-y-6">
        {/* Course Summary Card */}
        <Card className="bg-muted/50 border-border shadow-none">
          <CardContent className="flex gap-4 p-4">
            <div className="w-24 h-24 rounded-lg bg-primary/10 flex-shrink-0 overflow-hidden relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7EOTJVzTHlBqIC7pO-XtINNQHjIIiE_EYphrwOgL0POV_KQ1FAa5MgX7oEvbEoGJo0Mleh51sj72rISHR7dzQ1k9ONhynbMd5TUBvMEv7FnYU1-QYplNal9vv4NMchU812XMlZzF3-oQo2tajjg0uH9blwAn8oR83rattorUFvDGvyTyxEUKZPYqMU310SgighKvlabifO10SYktzhbegd7PYvlROLitZtOsPiI4b1R65UylSjoVJkuvvyEE3KTM1cWfFVkJnHHI"
                alt="Advanced Python Development Course"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Advanced Course
              </span>
              <h3 className="text-lg font-bold text-foreground leading-tight">
                Advanced Python for Data Science
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tutor:{" "}
                <span className="font-bold text-foreground">
                  Dr. Sarah Jenkins
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Price Row */}
        <div className="flex justify-between items-center px-2">
          <span className="text-sm text-muted-foreground">
            Course Enrollment Fee
          </span>
          <span className="text-xl font-bold text-primary">$499.00</span>
        </div>

        <Separator className="bg-border" />

        {/* Selection Section */}
        <div className="space-y-4">
          {/* Start Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground font-bold">
              Select Starting Date
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 border-2 border-primary bg-primary/10 text-primary rounded-lg transition-all scale-[0.98]"
              >
                <span className="text-sm font-bold">Oct 15, 2024</span>
                <span className="text-[10px] uppercase opacity-80">
                  Next Monday
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 border-2 border-border hover:border-primary/50 text-foreground rounded-lg transition-all"
              >
                <span className="text-sm font-bold">Nov 01, 2024</span>
                <span className="text-[10px] uppercase opacity-60">
                  Early November
                </span>
              </button>
            </div>
          </div>

          {/* Study Shift Selection */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground font-bold">
              Preferred Study Shift
            </Label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                <input
                  type="radio"
                  name="shift"
                  defaultChecked
                  className="w-5 h-5 text-primary border-border focus:ring-primary accent-primary"
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-foreground">
                    Morning Session
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    09:00 AM - 12:00 PM EST
                  </p>
                </div>
                <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary">
                  wb_sunny
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                <input
                  type="radio"
                  name="shift"
                  className="w-5 h-5 text-primary border-border focus:ring-primary accent-primary"
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-foreground">
                    Evening Session
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    06:00 PM - 09:00 PM EST
                  </p>
                </div>
                <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary">
                  dark_mode
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <Label className="flex items-start gap-3 cursor-pointer group font-normal">
          <Checkbox className="mt-1" />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
            I agree to the{" "}
            <a
              href="#"
              className="text-primary underline decoration-primary/30 hover:decoration-primary"
            >
              Terms of Enrollment
            </a>{" "}
            and Student Privacy Policy.
          </span>
        </Label>
      </div>
    </Modal>
  );
};

export default PaymentModal;
