import type { ReactNode } from "react";

import { Button } from "@/src/shared/components/ui/button";
import { Spinner } from "@/src/shared/components/ui/spinner";

type SubmitButtonProps = {
  isLoading?: boolean;
  children: ReactNode;
};

export default function SubmitButton({
  isLoading = false,
  children,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="h-12 w-full text-sm font-bold"
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </Button>
  );
}
