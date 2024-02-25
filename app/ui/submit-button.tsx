"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  enabledMessage: string;
  disabledMessage: string;
  children?: React.ReactNode;
}

export function SubmitButton({
  enabledMessage,
  disabledMessage,
  children,
  className,
  ...rest
}: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      {...rest}
      className={`${className} m-1 h-10 items-center rounded-lg bg-violet-800 px-4 text-sm 
        font-medium text-white transition-colors hover:bg-violet-900 focus-visible:outline 
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 
        active:bg-violet-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
    >
      {pending ? disabledMessage : enabledMessage}
      {children}
    </button>
  );
}
