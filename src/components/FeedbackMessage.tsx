export type Feedback = {
  type: "success" | "error";
  text: string;
};

interface FeedbackMessageProps {
  feedback: Feedback | null;
}

export default function FeedbackMessage({ feedback }: FeedbackMessageProps) {
  if (!feedback) return null;

  return (
    <p
      role={feedback.type === "error" ? "alert" : "status"}
      style={{
        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
        fontSize: "0.7rem",
        lineHeight: "1.4",
        margin: 0,
        padding: "0.375rem 0.625rem",
        borderRadius: "3px",
        borderLeft: `2px solid ${
          feedback.type === "success" ? "var(--accent)" : "var(--danger)"
        }`,
        background:
          feedback.type === "success"
            ? "var(--accent-dim)"
            : "var(--danger-dim)",
        color: feedback.type === "success" ? "var(--accent)" : "var(--danger)",
        letterSpacing: "0.02em",
      }}
    >
      {feedback.text}
    </p>
  );
}
