"use client";

import React, { useState } from "react";
import { MultiStepFormPresenter } from "./multi-step-form-presenter";

export interface MultiStepFormStepConfig {
  title: string;
  content: (props: {
    onNext: () => void;
    onPrevious: () => void;
  }) => React.ReactNode;
  sidebar?: React.ReactNode;
}

export interface MultiStepFormContainerProps {
  title: string;
  steps: MultiStepFormStepConfig[];
}

export function MultiStepFormContainer({
  title,
  steps,
}: MultiStepFormContainerProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const stepperSteps = steps.map((s, idx) => ({
    number: idx + 1,
    title: s.title,
  }));
  const activeStepConfig = steps[currentStep - 1];

  return (
    <MultiStepFormPresenter
      title={title}
      currentStep={currentStep}
      stepperSteps={stepperSteps}
      activeContent={activeStepConfig.content({
        onNext: handleNextStep,
        onPrevious: handlePreviousStep,
      })}
      activeSidebar={activeStepConfig.sidebar}
    />
  );
}
