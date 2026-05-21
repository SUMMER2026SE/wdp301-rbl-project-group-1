import React from "react";
import { MultiStepFormStepper, type Step } from "./multi-step-form-stepper";

export interface MultiStepFormPresenterProps {
  title: string;
  currentStep: number;
  stepperSteps: Step[];
  activeContent: React.ReactNode;
  activeSidebar?: React.ReactNode;
}

export function MultiStepFormPresenter({
  title,
  currentStep,
  stepperSteps,
  activeContent,
  activeSidebar,
}: MultiStepFormPresenterProps) {
  return (
    <main className="flex-1 flex flex-col items-center w-full py-10 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-foreground text-center mb-8">
          {title}
        </h1>

        <MultiStepFormStepper currentStep={currentStep} steps={stepperSteps} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-2/3">{activeContent}</div>
          {activeSidebar}
        </div>
      </div>
    </main>
  );
}
