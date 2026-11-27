"use client";

import { Children, cloneElement, isValidElement, type FormEvent, type ReactElement, type ReactNode } from "react";
import styles from "./a7k2-stacked-card.module.css";

type FormProps = {
  className?: string;
  children?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

type FormScope = {
  email: string;
  emailValid: boolean;
  role: string;
  excitement: string | null;
  visibleStatus: string;
  previewStatus: string | null;
  clearPreview: () => void;
  setStatus: (status: "success") => void;
  onSubmitted?: () => void;
};

type ChildProps = { children?: ReactNode; type?: string; disabled?: boolean };

function updateSubmitButton(node: ReactNode, disabled: boolean): ReactNode {
  if (!isValidElement<ChildProps>(node)) return node;
  if (node.type === "button" && node.props.type === "submit") {
    return cloneElement(node, { disabled });
  }
  if (node.props.children === undefined) return node;
  return cloneElement(node, {
    children: Children.map(node.props.children, (child) => updateSubmitButton(child, disabled)),
  });
}

export default function Variant({ scope, original }: { props: Record<string, unknown>; scope: Record<string, unknown>; original: ReactElement<FormProps> }) {
  const form = scope as FormScope;
  const canSubmit = form.email.trim().length > 0 && form.emailValid && form.role.trim().length > 0 && form.excitement !== null;
  const submitting = form.visibleStatus === "submitting";
  const fields = Children.toArray(original.props.children);
  const footer = updateSubmitButton(fields[4], submitting || !canSubmit);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting || (form.previewStatus !== null && form.previewStatus !== "idle")) return;
    // This shorter prototype previews success without sending an incomplete
    // request to the live endpoint, which also requires a Twitter handle.
    form.clearPreview();
    form.setStatus("success");
    form.onSubmitted?.();
  }

  return cloneElement(original, {
    className: `${original.props.className ?? ""} ${styles.layout}`,
    onSubmit: submit,
    children: [fields[0], fields[1], footer],
  });
}
