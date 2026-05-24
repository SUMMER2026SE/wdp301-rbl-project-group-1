import Image from "next/image";

export const BankTransferDetails = () => {
  return (
    <div className="mt-4 grid md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg border border-border/50 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col items-center justify-center bg-background p-4 rounded shadow-sm">
        <div className="relative w-32 h-32 grayscale hover:grayscale-0 transition-all">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC_RraTvPNCLVZnSaXlQp7_O3vAQhJvvFaudL_-_1bBqZrczaSbhSRCEjgA70I7Wp5pMBUZyRN0K3X3kpHp6ilYWCiGSfoB6Kd88FjC0i2dHPMu92s--rpd9-HyQ78oXXNh5QqWvmEKMkz1JOqpuSvLZIgo3eibTwKIVufEEt9BjBRN-iQw51kkCWiAU5SDqLr-IWJ17SK753AOBYA5lEnPRYas0qSmYSOPIe78wMu6RbOGP_rzBBVttQVDStRs_akou1Y0bgPyl4"
            alt="QR Code"
            fill
            className="object-contain"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground font-medium">
          Scan to pay
        </p>
      </div>
      <div className="space-y-3 flex flex-col justify-center">
        <div>
          <p className="text-xs text-muted-foreground">Beneficiary</p>
          <p className="text-sm font-bold text-foreground">
            TUTOR CONNECT EDU JSC
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Bank Name</p>
          <p className="text-sm text-foreground">Techcombank - Head Office</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Account Number</p>
          <p className="text-sm font-bold text-primary tracking-wider">
            1903 4567 8901 23
          </p>
        </div>
      </div>
    </div>
  );
};
