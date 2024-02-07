interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`${className} m-1 h-10 items-center rounded-lg bg-violet-800 px-4 text-sm font-medium text-white transition-colors 
      hover:bg-violet-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
      focus-visible:outline-violet-700 active:bg-violet-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}>
      {children}
    </button>
  );
}
