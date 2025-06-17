import Link from "next/link";
import { type ComponentProps } from "react";

const buttonVariants = {
  default:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-black text-white shadow-xs hover:bg-black/90 h-9 px-4 py-2",
  link: "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,box-shadow] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer focus-visible:ring-ring/50 focus-visible:ring-[3px] text-black underline-offset-4 hover:underline",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

type BaseButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type DefaultButtonProps = BaseButtonProps &
  ComponentProps<"button"> & {
    variant?: "default";
    href?: never;
  };

type LinkButtonProps = BaseButtonProps &
  ComponentProps<typeof Link> & {
    variant: "link";
    href: string;
  };

type ButtonProps = DefaultButtonProps | LinkButtonProps;

const combineClasses = (baseClass: string, additionalClass?: string) => {
  return additionalClass ? `${baseClass} ${additionalClass}` : baseClass;
};

export const Button = ({
  variant = "default",
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseClasses = buttonVariants[variant];
  const finalClasses = combineClasses(baseClasses, className);

  if (variant === "link") {
    const { href, ...linkProps } = props as LinkButtonProps;
    return (
      <Link href={href} className={finalClasses} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={finalClasses} {...(props as DefaultButtonProps)}>
      {children}
    </button>
  );
};
