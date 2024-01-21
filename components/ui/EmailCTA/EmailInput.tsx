"use client";

import { FC } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EmailInputProps {
  className?: string;
}

const EmailInput: FC<EmailInputProps> = ({ className = "" }) => {
  const { pending } = useFormStatus();

  return (
    <div
      className={cn(
        "relative flex flex-col items-end justify-center gap-2",
        className,
      )}
    >
      <input
        autoComplete="off"
        className="mb-0 h-12 w-full rounded-full border border-opacity-20 bg-transparent px-6 py-3 transition-all duration-300 focus:border-gray-300 focus:outline-none xs:pr-40"
        name="email"
        placeholder="Enter Your Email"
        title="Email Input"
        type="email"
        aria-required
        required
      />
      <Button
        aria-disabled={pending}
        aria-label="Subscribe to my newsletter"
        className="right-1 w-full rounded-full bg-primary px-6 py-2.5 hover:bg-primary/90 xs:absolute xs:w-auto"
        disabled={pending}
        type="submit"
      >
        Subscribe
        <ArrowLeft className="ml-1 inline-block" size={20} aria-hidden />
      </Button>
    </div>
  );
};

export default EmailInput;
