import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Input } from "@/src/shared/components/ui/input";
import Image from "next/image";

export const OrderSummary = () => {
  return (
    <aside className="lg:col-span-5 space-y-6">
      <Card className="bg-muted/50 border-border shadow-sm p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 font-heading">
          Order Summary
        </h2>
        <div className="flex gap-4 mb-6">
          <div className="w-24 h-24 relative overflow-hidden rounded-lg shadow-sm flex-shrink-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBefuFz88sA7I8mMadTTbe1jtMydXwRQwz6oqpVLPWtZfs_XUwAOzTOvnWLnJqiT1SeeDZ6cTr2E4RjENGDY6VHg_-GkEPH4E8t6xKcBwihQiyUe0_lnUhpuJ5OQxqZ7BRmCto0OxqLRg3dp2a2_bu94aADVEqfMNGoTWyEY3QB3LumG2KGBsQyyNu0VRlUKVzv8juQv2gbYcB4JzefED911DCBLxXF9g50WXFu-4pVLqGRXrMzQaisOZ2bB7iWwHFqWvIoJFLJZBU"
              alt="Course Thumbnail"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-primary mb-1">
              IELTS Preparation
            </h3>
            <p className="text-sm font-bold text-foreground leading-tight">
              Luyện thi IELTS 7.5+ Masterclass
            </p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                person
              </span>
              Tutor: Dr. Nguyen Minh Anh
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Subtotal</span>
            <span className="text-foreground text-sm font-medium">
              6,500,000 VND
            </span>
          </div>
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-sm">Early Bird Discount (10%)</span>
            <span className="text-sm font-medium">-650,000 VND</span>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Discount Code
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter code"
              className="flex-grow bg-background"
            />
            <Button
              variant="secondary"
              className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-primary border-dashed">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-foreground font-heading">
              Total
            </span>
            <div className="text-right">
              <span className="block text-xs text-muted-foreground line-through mb-1">
                6,500,000 VND
              </span>
              <span className="text-2xl font-bold text-primary font-heading">
                5,850,000 VND
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-4 py-4 bg-muted/30 rounded-lg border border-border">
        <span className="material-symbols-outlined text-primary">
          verified_user
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          Secure SSL Encrypted Payment
        </span>
      </div>
    </aside>
  );
};
