import React from "react";

export interface Step {
  number: number;
  title: string;
}

export interface MultiStepFormStepperProps {
  currentStep: number;
  steps: Step[];
}

export function MultiStepFormStepper({
  currentStep,
  steps,
}: MultiStepFormStepperProps) {
  return (
    <div className="relative max-w-4xl mx-auto mb-10">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-secondary -translate-y-1/2 z-0 rounded-full"></div>

      <div
        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>

      <div className="relative z-10 flex justify-between">
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border-2 border-border text-muted-foreground"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary font-bold"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
