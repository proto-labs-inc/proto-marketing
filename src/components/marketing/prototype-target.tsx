"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type PrototypeTargetProps<T extends ElementType = "div"> = {
  id?: string;
  label?: string;
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "id" | "children" | "className">;

export function PrototypeTarget<T extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: PrototypeTargetProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component {...rest} className={cn(className)}>
      {children}
    </Component>
  );
}

export const PrototypeComponent = PrototypeTarget;
