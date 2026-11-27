"use client";

import { useRef, useState, type FormEvent } from "react";
import buttonStyles from "@/components/marketing/early-access-header.module.css";
import { inviteBodyLineHighlightClass } from "@/components/marketing/invite-layout-classes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEarlyAccessPreviewState } from "@/lib/use-early-access-preview-state";

import styles from "./page.module.css";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const excitementOptions = [
  { label: "Very", value: "very" },
  { label: "Very very", value: "very very" },
  { label: "Just email me already", value: "just email me already" },
];

function PriorityNote() {
  const priorityLink = <a href="https://x.com/maayanalbert" target="_blank" rel="noopener noreferrer"><strong className={styles.priorityDm}>DM</strong> Maayan</a>;
  return (
    <p className={styles.priorityNote}>
      <span className={inviteBodyLineHighlightClass}>
        <span className={styles.priorityFirstLine}>(if you really, really want access,</span><br />you can also {priorityLink})
      </span>
    </p>
  );
}

export function EarlyAccessForm({
  onSubmitted,
  waitlistCount,
  forcedStatus,
}: {
  onSubmitted?: () => void;
  waitlistCount: number | null;
  forcedStatus?: SubmissionStatus;
}) {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const { state: previewStatus, clear: clearPreview } = useEarlyAccessPreviewState();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [role, setRole] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [excitement, setExcitement] = useState<string | null>(null);
  const excitementFieldRef = useRef<HTMLDivElement>(null);
  const visibleStatus = forcedStatus ?? previewStatus ?? status;
  const canSubmit = email.trim().length > 0 && emailValid && role.trim().length > 0 && twitterHandle.trim().length > 0 && excitement !== null;
  const showEmailError = previewStatus === "invalid-email" || (emailBlurred && email.trim().length > 0 && !emailValid);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ((previewStatus !== null && previewStatus !== "idle") || !canSubmit || status === "submitting") return;

    const form = new FormData(event.currentTarget);
    clearPreview();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          role: form.get("role"),
          twitterHandle: form.get("twitterHandle"),
          excitement: form.get("excitement"),
          phone: form.get("phone"),
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Could not save your request. Please try again.");
      }
      setStatus("success");
      onSubmitted?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your request. Please try again.");
      setStatus("error");
    }
  }

  if (visibleStatus === "success") {
    return (
      <>
        <div className={styles.successRow}>
          <div className={styles.success} role="status">
            <p>
              <strong className="block">You&apos;re all set!</strong>
              {waitlistCount !== null ? (
                <>
                  We currently have a couple thousand people on our waitlist, so we&apos;re a bit backlogged, but we&apos;ll get back to you as fast as we can.
                </>
              ) : (
                <>We&apos;ll get back to you as fast as we can.</>
              )}
            </p>
          </div>
          <PriorityNote />
        </div>
      </>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <div className={styles.fieldHeading}>
          <label htmlFor="early-access-email">Work email</label>
          {showEmailError && <p id="early-access-email-error" className={styles.fieldError}>Enter a valid email address</p>}
        </div>
        <input
          id="early-access-email"
          name="email"
          type="email"
          value={previewStatus === "invalid-email" ? "not-an-email" : email}
          onChange={(event) => {
            setEmail(event.currentTarget.value);
            setEmailValid(event.currentTarget.validity.valid);
          }}
          onFocus={() => setEmailBlurred(false)}
          onBlur={() => setEmailBlurred(true)}
          aria-invalid={showEmailError}
          aria-describedby={showEmailError ? "early-access-email-error" : undefined}
          autoComplete="email"
          placeholder="ray@eams.design"
          maxLength={254}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="early-access-role">Role</label>
        <input
          id="early-access-role"
          name="role"
          type="text"
          value={role}
          onChange={(event) => setRole(event.currentTarget.value)}
          autoComplete="organization-title"
          placeholder="Product designer"
          maxLength={120}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="early-access-twitter-handle">Twitter handle</label>
        <input
          id="early-access-twitter-handle"
          name="twitterHandle"
          type="text"
          value={twitterHandle}
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          placeholder="@rayeams"
          maxLength={120}
          onChange={(event) => setTwitterHandle(event.currentTarget.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="early-access-phone">Phone number</label>
        <input
          id="early-access-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="5551234567"
          maxLength={40}
        />
      </div>

      <div className={styles.formFooter}>
        <div className={styles.formActions}>
          <div className={`${styles.field} ${styles.finalField}`} ref={excitementFieldRef}>
            <label id="early-access-excitement-label">How excited are you?</label>
            <Select name="excitement" required items={excitementOptions} value={excitement} onValueChange={setExcitement}>
              <SelectTrigger aria-labelledby="early-access-excitement-label" className={styles.selectTrigger}>
                <SelectValue placeholder="Choose one" />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                align="start"
                className={styles.selectContent}
                portalContainer={excitementFieldRef}
              >
                {excitementOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className={styles.selectItem}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={styles.submitAction}>
            <button className={`${buttonStyles.button} ${styles.submitButton}`} type="submit" data-submission-status={visibleStatus} disabled={visibleStatus === "submitting" || (previewStatus !== "error" && !canSubmit)}>
              <span>{visibleStatus === "submitting" ? "Submitting…" : "Submit"}</span>
            </button>
          </div>
        </div>
        {visibleStatus === "error" && (
          <p className={styles.error} role="alert">{previewStatus === "error" ? "Could not save your request. Please try again." : error}</p>
        )}
      </div>
    </form>
  );
}
