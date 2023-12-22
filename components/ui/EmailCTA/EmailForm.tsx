"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import EmailInput from "./EmailInput";

import { suscribeEmail } from "@/app/actions/suscribeEmail";
import { VisuallyHiddenText } from "@/components/VisuallyHiddenText";
import { cn } from "@/lib/utils";

interface EmailFormProps {
  className?: string;
  showInputOnly?: boolean;
}

export default function EmailForm({
  className = "",
  showInputOnly = false,
}: EmailFormProps) {
  const [state, formAction] = useFormState(suscribeEmail, {
    failed: false,
    message: null,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.failed) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className={cn(
        "flex flex-col items-center space-y-4 md:w-full",
        !showInputOnly && "md:items-stretch md:border-b-2 md:pb-10 md:pr-10",
        className,
      )}
      ref={formRef}
    >
      {!showInputOnly && (
        <h2 className="text-2xl font-semibold sm:text-left">
          Subscribe to my newsletter for daily tech insights
        </h2>
      )}
      <EmailInput className={cn(!showInputOnly && "max-w-sm")} />
      <VisuallyHiddenText description={state.message} />
    </form>
  );
}
