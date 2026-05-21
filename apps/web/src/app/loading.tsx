import { Spinner } from "@/src/shared/components/ui/spinner";

export default function LoadingPage() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
}
