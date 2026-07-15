import { useState, useRef, useMemo, useEffect } from "react";
import "leaflet/dist/leaflet.css";

// ─── Shared primitives ────────────────────────────────────────────────────────

const CREAM_BG = "#EDE8DF";
const FIELD_BG = "#F5F0E8";
const GOLD = "#D5A021";
const NEAR_BLACK = "#2A1F14";
const LABEL = "#4A3F32";
const MUTED = "#9A9080";
const CHARCOAL = "#6E6458";
const BORDER = "rgba(110, 100, 88, 0.18)";

function StatusBar({ dark = false }: { dark?: boolean }) {
  const ink = dark ? "#9A9080" : CHARCOAL;
  return (
    <div className="flex justify-between items-center px-6 pt-4 pb-2">
      <span style={{ color: ink, fontSize: "12px", fontWeight: 500 }}>9:41</span>
      <div className="flex gap-1 items-center">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <rect x="0" y="4" width="3" height="7" rx="0.5" fill={ink} />
          <rect x="4.5" y="2.5" width="3" height="8.5" rx="0.5" fill={ink} />
          <rect x="9" y="0.5" width="3" height="10.5" rx="0.5" fill={ink} />
          <rect x="13.5" y="0" width="2.5" height="11" rx="0.5" fill={ink} opacity="0.3" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={ink} strokeOpacity="0.4" />
          <rect x="2" y="2" width="17" height="8" rx="2" fill={ink} />
          <path d="M23 4.5V7.5C23.8 7.2 24.5 6.7 24.5 6C24.5 5.3 23.8 4.8 23 4.5Z" fill={ink} opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function NavRow({ onBack, dark = false }: { onBack: () => void; dark?: boolean }) {
  const bg = dark ? "rgba(216,208,192,0.1)" : "rgba(110,100,88,0.1)";
  const arrow = dark ? "#D8D0C0" : NEAR_BLACK;
  return (
    <div className="flex items-center px-5 pt-2 pb-1">
      <button
        onClick={onBack}
        className="flex items-center justify-center transition-all active:scale-95"
        style={{ width: "36px", height: "36px", borderRadius: "10px", background: bg, border: "none", cursor: "pointer" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke={arrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="flex items-center gap-2 ml-auto">
        <svg width="14" height="18" viewBox="0 0 32 40" fill="none">
          <path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill={GOLD} strokeLinejoin="round" />
        </svg>
        <span style={{ color: dark ? "#D8D0C0" : NEAR_BLACK, fontSize: "15px", fontWeight: 800, letterSpacing: "-0.5px" }}>iter</span>
      </div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  trailing,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: "block", color: LABEL, fontSize: "13px", fontWeight: 600, marginBottom: "7px", letterSpacing: "0.1px" }}>
        {label}
      </label>
      <div className="flex items-center" style={{ background: FIELD_BG, borderRadius: "12px", border: `1.5px solid ${BORDER}`, padding: "0 14px", height: "50px" }}>
        <span style={{ flexShrink: 0, marginRight: "10px", display: "flex" }}>{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: NEAR_BLACK, fontSize: "15px", fontWeight: 400 }}
        />
        {trailing}
      </div>
    </div>
  );
}

function GoldButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center transition-all active:scale-[0.98]"
      style={{ height: "54px", borderRadius: "14px", background: GOLD, color: "#1A1714", fontSize: "16px", fontWeight: 700, letterSpacing: "0.2px", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(213,160,33,0.28)" }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center transition-all active:scale-[0.98]"
      style={{ height: "54px", borderRadius: "14px", background: "transparent", color: NEAR_BLACK, fontSize: "16px", fontWeight: 600, letterSpacing: "0.2px", border: `1.5px solid rgba(110,100,88,0.35)`, cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill={MUTED} />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill={MUTED} />
  </svg>
);

const EyeIcon = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", marginLeft: "4px", display: "flex" }}>
    {open ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill={MUTED} />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8Z" fill={MUTED} />
      </svg>
    )}
  </button>
);

// ─── Screen 1: Reset your password ───────────────────────────────────────────

function ForgotPasswordScreen({ onBack, onSend }: { onBack: () => void; onSend: () => void }) {
  const [email, setEmail] = useState("");

  return (
    <>
      <StatusBar />
      <NavRow onBack={onBack} />

      <div className="flex flex-col px-6" style={{ paddingTop: "36px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: GOLD, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: "8px" }}>
            Reset your password
          </h1>
          <p style={{ color: MUTED, fontSize: "14px", fontWeight: 400, lineHeight: 1.6 }}>
            Enter the email address linked to your account and we&apos;ll send a reset link.
          </p>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            icon={<EmailIcon />}
          />
        </div>

        <GoldButton onClick={onSend}>Send Reset Link</GoldButton>
      </div>

      <div className="flex-1 flex items-end justify-center pb-12 pt-6">
        <p style={{ color: MUTED, fontSize: "14px" }}>
          Remember your password?{" "}
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: "14px", fontWeight: 600, padding: 0 }}>
            Sign In
          </button>
        </p>
      </div>
    </>
  );
}

// ─── Screen 2: Check your email ──────────────────────────────────────────────

function CheckEmailScreen({ onBack }: { onBack: () => void }) {
  return (
    <>
      <StatusBar />
      <NavRow onBack={onBack} />

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" style={{ paddingBottom: "40px" }}>
        {/* Mail icon */}
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "24px",
            background: "rgba(213,160,33,0.1)",
            border: `1.5px solid rgba(213,160,33,0.22)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill={GOLD} />
          </svg>
        </div>

        <h1 style={{ color: NEAR_BLACK, fontSize: "26px", fontWeight: 700, letterSpacing: "-0.4px", lineHeight: 1.25, marginBottom: "12px" }}>
          Check your email
        </h1>
        <p style={{ color: MUTED, fontSize: "14px", fontWeight: 400, lineHeight: 1.65, maxWidth: "270px" }}>
          We&apos;ve sent a password reset link to your inbox. It may take a minute to arrive.
        </p>

        {/* Hint pill */}
        <div
          style={{
            marginTop: "28px",
            padding: "10px 18px",
            borderRadius: "10px",
            background: "rgba(110,100,88,0.08)",
            border: `1px solid rgba(110,100,88,0.15)`,
          }}
        >
          <p style={{ color: CHARCOAL, fontSize: "13px", fontWeight: 500, lineHeight: 1.5 }}>
            Didn&apos;t receive it?{" "}
            <span style={{ color: GOLD, cursor: "pointer" }}>Resend link</span>
          </p>
        </div>
      </div>

      <div className="px-6" style={{ paddingBottom: "52px" }}>
        <OutlineButton onClick={onBack}>Back to Login</OutlineButton>
      </div>
    </>
  );
}

// ─── Screen 3: Set a new password ────────────────────────────────────────────

function SetPasswordScreen({ onDone }: { onDone: () => void }) {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const match = newPw.length > 0 && confirmPw.length > 0 && newPw === confirmPw;
  const mismatch = confirmPw.length > 0 && newPw !== confirmPw;

  const strength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "#C0392B", "#D5A021", "#5A8A5A"][strength];
  const strengthWidths = ["0%", "33%", "66%", "100%"];

  return (
    <>
      <StatusBar />
      <NavRow onBack={onDone} />

      <div className="flex flex-col px-6" style={{ paddingTop: "36px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: GOLD, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: "8px" }}>
            Set a new password
          </h1>
          <p style={{ color: MUTED, fontSize: "14px", fontWeight: 400, lineHeight: 1.6 }}>
            Choose something strong — you won&apos;t need to remember the old one.
          </p>
        </div>

        <div className="flex flex-col gap-4" style={{ marginBottom: "8px" }}>
          <InputField
            label="New Password"
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            value={newPw}
            onChange={setNewPw}
            icon={<LockIcon />}
            trailing={<EyeIcon open={showNew} onClick={() => setShowNew(!showNew)} />}
          />

          {/* Strength meter */}
          {newPw.length > 0 && (
            <div>
              <div style={{ height: "4px", borderRadius: "2px", background: "rgba(110,100,88,0.15)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: strengthWidths[strength], background: strengthColor, borderRadius: "2px", transition: "width 0.3s ease, background 0.3s ease" }} />
              </div>
              <p style={{ color: strengthColor, fontSize: "12px", fontWeight: 600, marginTop: "5px", textAlign: "right", transition: "color 0.3s ease" }}>
                {strengthLabel}
              </p>
            </div>
          )}

          <div>
            <InputField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPw}
              onChange={setConfirmPw}
              icon={<LockIcon />}
              trailing={<EyeIcon open={showConfirm} onClick={() => setShowConfirm(!showConfirm)} />}
            />
            {mismatch && (
              <p style={{ color: "#C0392B", fontSize: "12px", fontWeight: 500, marginTop: "5px" }}>
                Passwords don&apos;t match
              </p>
            )}
            {match && (
              <p style={{ color: "#5A8A5A", fontSize: "12px", fontWeight: 500, marginTop: "5px" }}>
                ✓ Passwords match
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: "28px" }}>
          <GoldButton onClick={match ? onDone : undefined}>Reset Password</GoldButton>
        </div>
      </div>
    </>
  );
}

// ─── Sign In screen ───────────────────────────────────────────────────────────

function SignInScreen({
  onBack,
  onForgot,
  onSignUp,
}: {
  onBack: () => void;
  onForgot: () => void;
  onSignUp: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <StatusBar />
      <NavRow onBack={onBack} />

      <div className="flex flex-col px-6" style={{ paddingTop: "32px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: GOLD, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: "6px" }}>
            Welcome Back
          </h1>
          <p style={{ color: MUTED, fontSize: "14px", fontWeight: 400, lineHeight: 1.5 }}>
            Sign in to continue your journey.
          </p>
        </div>

        <div className="flex flex-col gap-4" style={{ marginBottom: "8px" }}>
          <InputField label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} icon={<EmailIcon />} />
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            icon={<LockIcon />}
            trailing={<EyeIcon open={showPassword} onClick={() => setShowPassword(!showPassword)} />}
          />
        </div>

        <div className="flex justify-end" style={{ marginBottom: "28px" }}>
          <button onClick={onForgot} style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: "13px", fontWeight: 600, padding: "6px 0" }}>
            Forgot password?
          </button>
        </div>

        <GoldButton>Sign In</GoldButton>
      </div>

      <div className="flex-1 flex items-end justify-center pb-12 pt-6">
        <p style={{ color: MUTED, fontSize: "14px" }}>
          Don&apos;t have an account?{" "}
          <button onClick={onSignUp} style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: "14px", fontWeight: 600, padding: 0 }}>
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
}

// ─── Sign Up screen ───────────────────────────────────────────────────────────

function SignUpScreen({ onBack, onSignIn }: { onBack: () => void; onSignIn: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "#C0392B", "#D5A021", "#5A8A5A"][strength];
  const strengthWidths = ["0%", "33%", "66%", "100%"];
  const match = password.length > 0 && confirm.length > 0 && password === confirm;
  const mismatch = confirm.length > 0 && password !== confirm;

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill={MUTED} />
    </svg>
  );

  return (
    <>
      <StatusBar />
      <NavRow onBack={onBack} />

      {/* Scrollable form area */}
      <div
        className="flex flex-col px-6 overflow-y-auto"
        style={{ paddingTop: "28px", paddingBottom: "32px", flex: 1 }}
      >
        {/* Heading */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: GOLD, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: "6px" }}>
            Create Account
          </h1>
          <p style={{ color: MUTED, fontSize: "14px", fontWeight: 400, lineHeight: 1.5 }}>
            Sign up to get started with your journey.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4" style={{ marginBottom: "8px" }}>
          <InputField
            label="Username"
            placeholder="johndoe123"
            value={username}
            onChange={setUsername}
            icon={<UserIcon />}
          />

          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            icon={<EmailIcon />}
          />

          <div>
            <InputField
              label="Password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              icon={<LockIcon />}
              trailing={<EyeIcon open={showPw} onClick={() => setShowPw(!showPw)} />}
            />
            {password.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ height: "3px", borderRadius: "2px", background: "rgba(110,100,88,0.15)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: strengthWidths[strength], background: strengthColor, borderRadius: "2px", transition: "width 0.3s ease, background 0.3s ease" }} />
                </div>
                <p style={{ color: strengthColor, fontSize: "11px", fontWeight: 600, marginTop: "4px", textAlign: "right" }}>
                  {strengthLabel}
                </p>
              </div>
            )}
          </div>

          <div>
            <InputField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirm}
              onChange={setConfirm}
              icon={<LockIcon />}
              trailing={<EyeIcon open={showConfirm} onClick={() => setShowConfirm(!showConfirm)} />}
            />
            {mismatch && (
              <p style={{ color: "#C0392B", fontSize: "12px", fontWeight: 500, marginTop: "5px" }}>
                Passwords don&apos;t match
              </p>
            )}
            {match && (
              <p style={{ color: "#5A8A5A", fontSize: "12px", fontWeight: 500, marginTop: "5px" }}>
                ✓ Passwords match
              </p>
            )}
          </div>
        </div>

        {/* Terms nudge */}
        <p style={{ color: MUTED, fontSize: "12px", lineHeight: 1.6, marginTop: "16px", marginBottom: "24px" }}>
          By creating an account you agree to our{" "}
          <span style={{ color: GOLD, cursor: "pointer" }}>Terms of Service</span>{" "}
          and{" "}
          <span style={{ color: GOLD, cursor: "pointer" }}>Privacy Policy</span>.
        </p>

        <GoldButton>Create Account</GoldButton>

        {/* Sign in link */}
        <div className="flex justify-center" style={{ marginTop: "24px" }}>
          <p style={{ color: MUTED, fontSize: "14px" }}>
            Already have an account?{" "}
            <button
              onClick={onSignIn}
              style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: "14px", fontWeight: 600, padding: 0 }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Verify Email screen ──────────────────────────────────────────────────────

function VerifyEmailScreen({ onBack, onVerified }: { onBack: () => void; onVerified: () => void }) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [hasError, setHasError] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = char;
    setDigits(next);
    setHasError(false);
    if (char && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length) {
      const next = [...digits];
      pasted.split("").forEach((c, i) => { next[i] = c; });
      setDigits(next);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = () => {
    const code = digits.join("");
    if (code.length < 6) { setHasError(true); return; }
    // Simulate wrong code for demo — any code other than "123456" triggers error
    if (code !== "123456") { setHasError(true); return; }
    onVerified();
  };

  const handleResend = () => {
    setResent(true);
    setDigits(["", "", "", "", "", ""]);
    setHasError(false);
    inputRefs.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);
  };

  const filled = digits.filter(Boolean).length;
  // Which box index to highlight red on error
  const errorIndex = hasError ? digits.findLastIndex((d) => d !== "") : -1;

  return (
    <>
      <StatusBar />
      <NavRow onBack={onBack} />

      <div className="flex flex-col px-6" style={{ paddingTop: "36px" }}>
        {/* Heading */}
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ color: GOLD, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: "8px" }}>
            Verify your email
          </h1>
          <p style={{ color: MUTED, fontSize: "14px", fontWeight: 400, lineHeight: 1.65 }}>
            We sent a 6-digit code to{" "}
            <span style={{ color: NEAR_BLACK, fontWeight: 600 }}>sarah@example.com</span>.
            Enter it below to confirm your account.
          </p>
        </div>

        {/* Code boxes */}
        <div className="flex gap-2.5 justify-between" style={{ marginBottom: "12px" }} onPaste={handlePaste}>
          {digits.map((d, i) => {
            const isError = hasError && i === errorIndex;
            const isFilled = d !== "";
            return (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: "46px",
                  height: "56px",
                  borderRadius: "12px",
                  border: `2px solid ${isError ? "#C0392B" : isFilled ? GOLD : "rgba(110,100,88,0.22)"}`,
                  background: isError ? "rgba(192,57,43,0.06)" : isFilled ? "rgba(213,160,33,0.07)" : FIELD_BG,
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: isError ? "#C0392B" : NEAR_BLACK,
                  outline: "none",
                  caretColor: GOLD,
                  transition: "border 0.15s ease, background 0.15s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            );
          })}
        </div>

        {/* Progress hint */}
        <div className="flex justify-between items-center" style={{ marginBottom: "28px" }}>
          {hasError ? (
            <p style={{ color: "#C0392B", fontSize: "13px", fontWeight: 500 }}>
              Invalid code — please try again.
            </p>
          ) : (
            <p style={{ color: MUTED, fontSize: "13px" }}>
              {filled}/6 digits entered
            </p>
          )}
        </div>

        {/* Verify button */}
        <GoldButton onClick={handleVerify}>Verify</GoldButton>

        {/* Resend */}
        <div className="flex justify-center" style={{ marginTop: "20px" }}>
          {resent ? (
            <p style={{ color: "#5A8A5A", fontSize: "14px", fontWeight: 500 }}>
              ✓ Code resent to your inbox
            </p>
          ) : (
            <p style={{ color: MUTED, fontSize: "14px" }}>
              Didn&apos;t receive it?{" "}
              <button
                onClick={handleResend}
                style={{ background: "none", border: "none", cursor: "pointer", color: CHARCOAL, fontSize: "14px", fontWeight: 600, padding: 0, textDecoration: "underline", textDecorationColor: "rgba(110,100,88,0.4)" }}
              >
                Resend code
              </button>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Welcome screen ───────────────────────────────────────────────────────────

function WelcomeScreen({ onLogin, onSignUp }: { onLogin: () => void; onSignUp: () => void }) {
  return (
    <>
      <StatusBar dark />
      <div className="flex-1 flex flex-col items-center justify-center px-8" style={{ paddingTop: "48px" }}>
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center" style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(213,160,33,0.12)", border: "1.5px solid rgba(213,160,33,0.25)" }}>
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
              <path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill={GOLD} stroke={GOLD} strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ color: "#D8D0C0", fontSize: "42px", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1 }}>iter</span>
        </div>
        <div style={{ width: "40px", height: "1.5px", background: "rgba(213,160,33,0.5)", borderRadius: "2px", margin: "40px 0" }} />
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 style={{ color: "#D8D0C0", fontSize: "28px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.5px" }}>Track every mile.</h1>
          <p style={{ color: MUTED, fontSize: "15px", fontWeight: 400, lineHeight: 1.5, maxWidth: "240px" }}>Your runs, your pace, your progress — all in one place.</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-6" style={{ paddingBottom: "52px" }}>
        <button onClick={onLogin} className="w-full flex items-center justify-center transition-all active:scale-[0.98]" style={{ height: "54px", borderRadius: "14px", background: GOLD, color: "#1A1714", fontSize: "16px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(213,160,33,0.35)" }}>
          Log In
        </button>
        <button onClick={onSignUp} className="w-full flex items-center justify-center transition-all active:scale-[0.98]" style={{ height: "54px", borderRadius: "14px", background: "transparent", color: "#D8D0C0", fontSize: "16px", fontWeight: 600, border: "1.5px solid rgba(216,208,192,0.3)", cursor: "pointer" }}>
          Sign Up
        </button>
        <p className="text-center mt-1" style={{ color: "#6E6458", fontSize: "12px", lineHeight: 1.5 }}>
          By continuing you agree to our <span style={{ color: GOLD, cursor: "pointer" }}>Terms</span> &amp; <span style={{ color: GOLD, cursor: "pointer" }}>Privacy Policy</span>
        </p>
      </div>
    </>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

type Tab = "home" | "paths" | "calendar" | "profile";

const TAB_ICONS: Record<Tab, (active: boolean) => React.ReactNode> = {
  home: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill={a ? GOLD : "none"} stroke={a ? GOLD : CHARCOAL} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  paths: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill={a ? GOLD : "none"} stroke={a ? GOLD : CHARCOAL} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="3" stroke={a ? GOLD : CHARCOAL} strokeWidth="1.6" />
      <path d="M3 9H21" stroke={a ? GOLD : CHARCOAL} strokeWidth="1.6" />
      <path d="M8 2V5M16 2V5" stroke={a ? GOLD : CHARCOAL} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="7" y="13" width="2.5" height="2.5" rx="0.5" fill={a ? GOLD : CHARCOAL} />
      <rect x="10.75" y="13" width="2.5" height="2.5" rx="0.5" fill={a ? GOLD : CHARCOAL} />
      <rect x="14.5" y="13" width="2.5" height="2.5" rx="0.5" fill={a ? GOLD : CHARCOAL} />
    </svg>
  ),
  profile: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={a ? GOLD : CHARCOAL} strokeWidth="1.6" fill={a ? GOLD : "none"} fillOpacity="0.15" />
      <path d="M4 20C4 17 7.58 14.5 12 14.5C16.42 14.5 20 17 20 20" stroke={a ? GOLD : CHARCOAL} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "paths", label: "Paths" },
    { id: "calendar", label: "Calendar" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div
      style={{
        display: "flex",
        borderTop: `1px solid rgba(110,100,88,0.14)`,
        background: "#F5F0E8",
        paddingBottom: "20px",
        paddingTop: "10px",
        flexShrink: 0,
      }}
    >
      {tabs.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            {TAB_ICONS[id](isActive)}
            <span style={{ fontSize: "10px", fontWeight: 600, color: isActive ? GOLD : CHARCOAL, letterSpacing: "0.2px" }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Placeholder tab content ──────────────────────────────────────────────────

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center" style={{ color: MUTED, fontSize: "15px", fontWeight: 500 }}>
      <span style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.4 }}>○</span>
      {label} coming soon
    </div>
  );
}

// ─── Route thumbnail SVGs ─────────────────────────────────────────────────────

function RouteThumbnail({ path, color = GOLD }: { path: string; color?: string }) {
  return (
    <svg width="88" height="72" viewBox="0 0 88 72" fill="none" style={{ display: "block", borderRadius: "10px" }}>
      {/* Map background */}
      <rect width="88" height="72" fill="#D8D3CA" rx="10" />
      {/* Street grid */}
      <line x1="0" y1="18" x2="88" y2="18" stroke="#C8C2B8" strokeWidth="1.5" />
      <line x1="0" y1="36" x2="88" y2="36" stroke="#C8C2B8" strokeWidth="1.5" />
      <line x1="0" y1="54" x2="88" y2="54" stroke="#C8C2B8" strokeWidth="1.5" />
      <line x1="22" y1="0" x2="22" y2="72" stroke="#C8C2B8" strokeWidth="1.5" />
      <line x1="44" y1="0" x2="44" y2="72" stroke="#C8C2B8" strokeWidth="1.5" />
      <line x1="66" y1="0" x2="66" y2="72" stroke="#C8C2B8" strokeWidth="1.5" />
      {/* Route */}
      <path d={path} stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Start dot */}
      {path && (() => {
        const m = path.match(/M\s*([\d.]+)\s+([\d.]+)/);
        if (!m) return null;
        return <circle cx={m[1]} cy={m[2]} r="4" fill={color} stroke="#fff" strokeWidth="1.5" />;
      })()}
      {/* End dot — white fill */}
      {path && (() => {
        const coords = [...path.matchAll(/([\d.]+)\s+([\d.]+)/g)];
        if (!coords.length) return null;
        const last = coords[coords.length - 1];
        return <circle cx={last[1]} cy={last[2]} r="4" fill="#fff" stroke={color} strokeWidth="2" />;
      })()}
    </svg>
  );
}

const SAVED_PATHS = [
  {
    id: 1,
    name: "Morning Loop",
    distance: "3.2 mi",
    points: 8,
    date: "Saved Jul 4",
    svgPath: "M 14 36 C 14 20, 30 10, 44 12 C 58 14, 72 20, 74 36 C 74 52, 60 62, 44 60 C 28 58, 14 52, 14 36 Z",
  },
  {
    id: 2,
    name: "Riverside Trail",
    distance: "5.7 mi",
    points: 12,
    date: "Saved Jul 2",
    svgPath: "M 10 56 C 20 48, 18 28, 30 22 C 40 16, 48 30, 58 24 C 66 18, 72 12, 78 10",
  },
  {
    id: 3,
    name: "Park Circuit",
    distance: "2.1 mi",
    points: 6,
    date: "Saved Jun 29",
    svgPath: "M 16 54 L 16 18 L 72 18 L 72 54 L 44 54 L 16 54",
  },
  {
    id: 4,
    name: "Hill Climb",
    distance: "4.4 mi",
    points: 10,
    date: "Saved Jun 25",
    svgPath: "M 10 60 C 16 55, 20 48, 26 40 C 32 32, 36 26, 44 20 C 52 14, 62 16, 70 12",
  },
];

// ─── Saved Paths screen ───────────────────────────────────────────────────────

function SavedPathsTab({ onCreatePath }: { onCreatePath: () => void }) {
  const [isEmpty] = useState(false); // flip to true to preview empty state
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const selectedPath = SAVED_PATHS.find((p) => p.id === selectedId) ?? null;

  const openDetail = (id: number) => {
    setSelectedId(id);
    requestAnimationFrame(() => setDetailVisible(true));
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setTimeout(() => setSelectedId(null), 300);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: CREAM_BG, position: "relative", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4px" }}>
          <h1 style={{ color: NEAR_BLACK, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.6px" }}>Saved Paths</h1>
          {!isEmpty && (
            <span style={{ color: MUTED, fontSize: "13px", fontWeight: 500 }}>{SAVED_PATHS.length} routes</span>
          )}
        </div>
        {!isEmpty && (
          <p style={{ color: MUTED, fontSize: "13px", fontWeight: 400, marginBottom: "16px" }}>
            Tap a route to preview or start a run.
          </p>
        )}
      </div>

      {isEmpty ? (
        /* ── Empty state ── */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px 60px", textAlign: "center" }}>
          {/* Illustration */}
          <div style={{ width: "100px", height: "100px", borderRadius: "28px", background: FIELD_BG, border: `1.5px solid rgba(110,100,88,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              {/* Map outline */}
              <path d="M6 12L18 8L34 14L46 10V40L34 44L18 38L6 42V12Z" stroke={CHARCOAL} strokeWidth="2" strokeLinejoin="round" fill="none" strokeOpacity="0.5" />
              {/* Route dashes */}
              <path d="M14 28 C18 22, 24 32, 30 24 C34 18, 38 24, 38 24" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" fill="none" />
              {/* Plus badge */}
              <circle cx="40" cy="12" r="9" fill={GOLD} />
              <path d="M40 8V16M36 12H44" stroke="#1A1714" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 style={{ color: NEAR_BLACK, fontSize: "20px", fontWeight: 700, letterSpacing: "-0.4px", marginBottom: "8px" }}>No saved paths yet</h2>
          <p style={{ color: MUTED, fontSize: "14px", lineHeight: 1.6, marginBottom: "32px" }}>
            Build your first route on the map and save it here to run it again anytime.
          </p>
          <button
            onClick={onCreatePath}
            style={{ height: "52px", paddingLeft: "28px", paddingRight: "28px", borderRadius: "14px", background: GOLD, color: "#1A1714", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(213,160,33,0.32)", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#1A1714" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            Create your first path
          </button>
        </div>
      ) : (
        /* ── Paths list ── */
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 24px" }}>
          {SAVED_PATHS.map((path) => {
            const isSelected = selectedId === path.id;
            return (
              <button
                key={path.id}
                onClick={() => openDetail(path.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: isSelected ? "#EDE8DF" : FIELD_BG,
                  border: `1.5px solid ${isSelected ? GOLD : "rgba(110,100,88,0.14)"}`,
                  borderRadius: "18px",
                  padding: "14px 14px 14px 14px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: isSelected ? `0 4px 20px rgba(213,160,33,0.18)` : "0 1px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.18s ease",
                }}
              >
                {/* Thumbnail */}
                <div style={{ flexShrink: 0, borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.12)" }}>
                  <RouteThumbnail path={path.svgPath} color={isSelected ? GOLD : "#B8934A"} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: NEAR_BLACK, fontSize: "15px", fontWeight: 700, letterSpacing: "-0.2px", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {path.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <span style={{ color: NEAR_BLACK, fontSize: "16px", fontWeight: 800, letterSpacing: "-0.4px" }}>{path.distance}</span>
                    <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: MUTED, display: "inline-block" }} />
                    <span style={{ color: MUTED, fontSize: "12px", fontWeight: 500 }}>{path.points} pts</span>
                  </div>
                  <p style={{ color: MUTED, fontSize: "11px", fontWeight: 500, letterSpacing: "0.1px" }}>{path.date}</p>
                </div>

                {/* Chevron */}
                <div style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "50%", background: isSelected ? "rgba(213,160,33,0.12)" : "rgba(110,100,88,0.08)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke={isSelected ? GOLD : CHARCOAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            );
          })}

          {/* Create more CTA */}
          <button
            onClick={onCreatePath}
            style={{ width: "100%", height: "50px", borderRadius: "14px", background: "transparent", border: `1.5px dashed rgba(213,160,33,0.45)`, color: GOLD, fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", marginTop: "4px" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            New path
          </button>
        </div>
      )}

      {/* ── Path detail bottom sheet ── */}
      {selectedId !== null && (
        <>
          <div
            onClick={closeDetail}
            style={{ position: "absolute", inset: 0, zIndex: 100, background: "rgba(26,23,20,0.35)", backdropFilter: "blur(2px)", opacity: detailVisible ? 1 : 0, transition: "opacity 0.28s ease" }}
          />
          <div
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 110, background: FIELD_BG, borderRadius: "24px 24px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.16)", padding: "0 0 32px", transform: detailVisible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)" }}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "99px", background: "rgba(110,100,88,0.22)" }} />
            </div>

            {selectedPath && (
              <div style={{ padding: "12px 22px 0" }}>
                {/* Route thumbnail — wide */}
                <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
                  <svg width="100%" viewBox="0 0 331 120" fill="none" style={{ display: "block" }}>
                    <rect width="331" height="120" fill="#D8D3CA" />
                    {[0,1,2,3,4,5].map(i => <line key={`h${i}`} x1="0" y1={i*24} x2="331" y2={i*24} stroke="#C8C2B8" strokeWidth="1.2" />)}
                    {[0,1,2,3,4,5,6,7,8,9].map(i => <line key={`v${i}`} x1={i*36} y1="0" x2={i*36} y2="120" stroke="#C8C2B8" strokeWidth="1.2" />)}
                    {/* Scale the thumbnail path to the wider view */}
                    <g transform="scale(3.76, 1.67) translate(0, 0)">
                      <path d={selectedPath.svgPath} stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </g>
                    {/* Start/end markers at scaled positions */}
                    {(() => {
                      const m = selectedPath.svgPath.match(/M\s*([\d.]+)\s+([\d.]+)/);
                      const coords = [...selectedPath.svgPath.matchAll(/([\d.]+)\s+([\d.]+)/g)];
                      if (!m || !coords.length) return null;
                      const sx = parseFloat(m[1]) * 3.76, sy = parseFloat(m[2]) * 1.67;
                      const last = coords[coords.length - 1];
                      const ex = parseFloat(last[1]) * 3.76, ey = parseFloat(last[2]) * 1.67;
                      return (
                        <>
                          <circle cx={sx} cy={sy} r="7" fill={GOLD} stroke="#fff" strokeWidth="2.5" />
                          <circle cx={ex} cy={ey} r="7" fill="#fff" stroke={GOLD} strokeWidth="2.5" />
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Name + stats */}
                <h2 style={{ color: NEAR_BLACK, fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "10px" }}>{selectedPath.name}</h2>
                <div style={{ display: "flex", gap: "10px", marginBottom: "22px" }}>
                  {[
                    { label: "Distance", value: selectedPath.distance },
                    { label: "Points", value: `${selectedPath.points}` },
                    { label: "Saved", value: selectedPath.date.replace("Saved ", "") },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ flex: 1, background: "#EDE8DF", borderRadius: "12px", padding: "10px 12px", border: `1px solid rgba(110,100,88,0.12)` }}>
                      <p style={{ color: MUTED, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{label}</p>
                      <p style={{ color: NEAR_BLACK, fontSize: "16px", fontWeight: 800, letterSpacing: "-0.3px" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={closeDetail} style={{ flex: 1, height: "52px", borderRadius: "14px", background: "transparent", color: NEAR_BLACK, fontSize: "15px", fontWeight: 600, border: `1.5px solid rgba(110,100,88,0.28)`, cursor: "pointer" }}>
                    Close
                  </button>
                  <button onClick={closeDetail} style={{ flex: 2, height: "52px", borderRadius: "14px", background: GOLD, color: "#1A1714", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(213,160,33,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                    <svg width="16" height="20" viewBox="0 0 32 40" fill="none">
                      <path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill="#1A1714" />
                    </svg>
                    Start Run
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Home tab content ─────────────────────────────────────────────────────────

const RECENT_RUNS = [
  { name: "Morning Loop", distance: "5.2 km", duration: "28 min", date: "Today", pace: "5:23 /km" },
  { name: "Riverside Trail", distance: "8.7 km", duration: "47 min", date: "Yesterday", pace: "5:41 /km" },
  { name: "Park Circuit", distance: "3.1 km", duration: "17 min", date: "Jul 3", pace: "5:10 /km" },
];

function HomeTab({ onCreatePath, onStartRun }: { onCreatePath: () => void; onStartRun: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: CREAM_BG }}>
      {/* Header */}
      <div
        style={{
          background: CREAM_BG,
          padding: "16px 20px 20px",
        }}
      >
        {/* Top row */}
        <div className="flex justify-between items-center" style={{ marginBottom: "20px" }}>
          <div>
            <p style={{ color: MUTED, fontSize: "13px", fontWeight: 500, marginBottom: "3px" }}>Sunday, July 6</p>
            <h1 style={{ color: NEAR_BLACK, fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px", lineHeight: 1.25 }}>
              Welcome back, <span style={{ color: GOLD }}>Sarah</span> 👋
            </h1>
          </div>
          {/* Avatar */}
          <div style={{ width: "42px", height: "42px", borderRadius: "14px", background: "rgba(213,160,33,0.15)", border: `1.5px solid rgba(213,160,33,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: GOLD, fontSize: "16px", fontWeight: 700 }}>S</span>
          </div>
        </div>

        {/* Weekly stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
          }}
        >
          {[
            { label: "This Week", value: "17.0", unit: "km" },
            { label: "Runs", value: "3", unit: "runs" },
            { label: "Avg Pace", value: "5:25", unit: "/km" },
          ].map(({ label, value, unit }) => (
            <div key={label} style={{ padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", background: FIELD_BG, borderRadius: "14px", border: `1px solid rgba(110,100,88,0.14)` }}>
              <span style={{ color: MUTED, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "5px" }}>{label}</span>
              <span style={{ color: NEAR_BLACK, fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</span>
              <span style={{ color: CHARCOAL, fontSize: "10px", fontWeight: 500, marginTop: "3px" }}>{unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 24px" }}>

        {/* Action cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>

          {/* Start a Run — gold fill */}
          <button
            onClick={onStartRun}
            className="transition-all active:scale-[0.98]"
            style={{
              width: "100%",
              borderRadius: "20px",
              background: `linear-gradient(135deg, #D5A021 0%, #C4911A 100%)`,
              border: "none",
              cursor: "pointer",
              padding: "22px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 6px 24px rgba(213,160,33,0.32)",
              textAlign: "left",
            }}
          >
            <div>
              <p style={{ color: "rgba(42,31,20,0.65)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Ready to go?</p>
              <p style={{ color: "#1A1714", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1 }}>Start a Run</p>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="26" height="32" viewBox="0 0 32 40" fill="none">
                <path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill="#1A1714" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          {/* Create a Path — outline */}
          <button
            onClick={onCreatePath}
            className="transition-all active:scale-[0.98]"
            style={{
              width: "100%",
              borderRadius: "20px",
              background: FIELD_BG,
              border: `1.5px solid rgba(110,100,88,0.22)`,
              cursor: "pointer",
              padding: "20px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              textAlign: "left",
            }}
          >
            <div>
              <p style={{ color: MUTED, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Plan ahead</p>
              <p style={{ color: NEAR_BLACK, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1 }}>Create a Path</p>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(110,100,88,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill={CHARCOAL} />
                <path d="M6 18C4.5 18.5 3.5 19.2 3.5 20C3.5 21.1 7.36 22 12 22C16.64 22 20.5 21.1 20.5 20C20.5 19.2 19.5 18.5 18 18" stroke={CHARCOAL} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </button>
        </div>

        {/* Recent Runs */}
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: "14px" }}>
            <h2 style={{ color: NEAR_BLACK, fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" }}>Recent Runs</h2>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: "13px", fontWeight: 600 }}>See all</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {RECENT_RUNS.map((run) => (
              <div
                key={run.name}
                style={{
                  background: FIELD_BG,
                  borderRadius: "16px",
                  border: `1px solid rgba(110,100,88,0.14)`,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  cursor: "pointer",
                }}
              >
                {/* Run icon dot */}
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(213,160,33,0.1)", border: `1px solid rgba(213,160,33,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="20" viewBox="0 0 32 40" fill="none">
                    <path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill={GOLD} />
                  </svg>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.2px", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {run.name}
                  </p>
                  <p style={{ color: MUTED, fontSize: "12px", fontWeight: 500 }}>
                    {run.date} · {run.duration}
                  </p>
                </div>

                {/* Distance + pace */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ color: NEAR_BLACK, fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" }}>{run.distance}</p>
                  <p style={{ color: MUTED, fontSize: "11px", fontWeight: 500, marginTop: "2px" }}>{run.pace}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Calendar tab ────────────────────────────────────────────────────────────

// Run log keyed by day-of-month for the demo month (July 2026)
const RUN_LOG: Record<number, { name: string; distance: string; pace: string; svgPath: string }> = {
  1:  { name: "Morning Loop",    distance: "3.2 mi", pace: "9:24 /mi", svgPath: SAVED_PATHS[0].svgPath },
  3:  { name: "Riverside Trail", distance: "5.7 mi", pace: "9:41 /mi", svgPath: SAVED_PATHS[1].svgPath },
  6:  { name: "Park Circuit",    distance: "2.1 mi", pace: "9:10 /mi", svgPath: SAVED_PATHS[2].svgPath },
  8:  { name: "Morning Loop",    distance: "3.4 mi", pace: "9:18 /mi", svgPath: SAVED_PATHS[0].svgPath },
  10: { name: "Hill Climb",      distance: "4.4 mi", pace: "10:02 /mi", svgPath: SAVED_PATHS[3].svgPath },
  13: { name: "Riverside Trail", distance: "5.9 mi", pace: "9:38 /mi", svgPath: SAVED_PATHS[1].svgPath },
  15: { name: "Park Circuit",    distance: "2.1 mi", pace: "9:05 /mi", svgPath: SAVED_PATHS[2].svgPath },
  17: { name: "Morning Loop",    distance: "3.2 mi", pace: "9:20 /mi", svgPath: SAVED_PATHS[0].svgPath },
  20: { name: "Hill Climb",      distance: "4.6 mi", pace: "9:55 /mi", svgPath: SAVED_PATHS[3].svgPath },
  22: { name: "Riverside Trail", distance: "5.7 mi", pace: "9:44 /mi", svgPath: SAVED_PATHS[1].svgPath },
  24: { name: "Morning Loop",    distance: "3.2 mi", pace: "9:15 /mi", svgPath: SAVED_PATHS[0].svgPath },
  27: { name: "Park Circuit",    distance: "2.1 mi", pace: "9:08 /mi", svgPath: SAVED_PATHS[2].svgPath },
};

// Jul 2026 = 31 days, starts Wednesday (offset 3 in Sun-anchored week)
const JULY_OFFSET = 3;
const JULY_DAYS   = 31;
const TODAY_DAY   = 6; // July 6, 2026

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function CalendarTab() {
  const [year,  setYear]  = useState(2026);
  const [month, setMonth] = useState(6); // 0-indexed → July
  const [selectedDay, setSelectedDay] = useState<number>(TODAY_DAY);

  const isCurrentMonth = year === 2026 && month === 6;

  // Compute grid — use real Date for generic month navigation
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const runDay = isCurrentMonth ? RUN_LOG[selectedDay] : null;
  const totalRuns = isCurrentMonth ? Object.keys(RUN_LOG).length : 0;
  const totalMiles = isCurrentMonth
    ? Object.values(RUN_LOG).reduce((s, r) => s + parseFloat(r.distance), 0).toFixed(1)
    : "0.0";

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(1);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: CREAM_BG, overflowY: "auto" }}>

      {/* ── Month header ── */}
      <div style={{ padding: "18px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <button
            onClick={prevMonth}
            style={{ width: "36px", height: "36px", borderRadius: "10px", background: FIELD_BG, border: `1px solid rgba(110,100,88,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke={NEAR_BLACK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: NEAR_BLACK, fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              {MONTH_NAMES[month]} {year}
            </h2>
            {isCurrentMonth && (
              <p style={{ color: MUTED, fontSize: "12px", fontWeight: 500, marginTop: "2px" }}>
                {totalRuns} runs · {totalMiles} mi this month
              </p>
            )}
          </div>

          <button
            onClick={nextMonth}
            style={{ width: "36px", height: "36px", borderRadius: "10px", background: FIELD_BG, border: `1px solid rgba(110,100,88,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke={NEAR_BLACK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* ── Calendar grid ── */}
        <div style={{ background: FIELD_BG, borderRadius: "20px", border: `1px solid rgba(110,100,88,0.13)`, overflow: "hidden", marginBottom: "16px" }}>
          {/* Day-of-week labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid rgba(110,100,88,0.1)` }}>
            {WEEKDAYS.map((d) => (
              <div key={d} style={{ textAlign: "center", padding: "10px 0 8px", color: MUTED, fontSize: "10px", fontWeight: 700, letterSpacing: "0.3px" }}>
                {d.slice(0, 1)}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "6px 4px 10px" }}>
            {cells.map((day, idx) => {
              if (day === null) return <div key={idx} />;

              const hasRun   = isCurrentMonth && !!RUN_LOG[day];
              const isToday  = isCurrentMonth && day === TODAY_DAY;
              const isSelect = day === selectedDay;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "4px 0 6px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "10px",
                    gap: "4px",
                  }}
                >
                  {/* Day number circle */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isSelect ? GOLD : "transparent",
                      boxShadow: isSelect ? "0 2px 10px rgba(213,160,33,0.35)" : "none",
                      border: isToday && !isSelect ? `1.5px solid ${GOLD}` : "1.5px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: isToday || isSelect ? 800 : 500,
                        color: isSelect ? "#1A1714" : isToday ? GOLD : NEAR_BLACK,
                        lineHeight: 1,
                      }}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Run dot */}
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: hasRun ? (isSelect ? "#1A1714" : GOLD) : "transparent",
                      transition: "background 0.15s",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Day detail ── */}
      <div style={{ padding: "0 16px 28px", flex: 1 }}>
        {runDay ? (
          <div>
            {/* Section label */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <p style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.2px" }}>
                July {selectedDay}
              </p>
              <span style={{ background: "rgba(213,160,33,0.12)", color: GOLD, fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "99px", border: `1px solid rgba(213,160,33,0.25)` }}>
                Run logged
              </span>
            </div>

            {/* Run card */}
            <div style={{ background: FIELD_BG, borderRadius: "20px", border: `1.5px solid rgba(110,100,88,0.14)`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              {/* Thumbnail */}
              <div style={{ borderBottom: `1px solid rgba(110,100,88,0.1)` }}>
                <svg width="100%" viewBox="0 0 343 110" fill="none" style={{ display: "block" }}>
                  <rect width="343" height="110" fill="#D8D3CA" />
                  {[0,1,2,3,4].map(i => <line key={`h${i}`} x1="0" y1={i*28} x2="343" y2={i*28} stroke="#C8C2B8" strokeWidth="1.1" />)}
                  {[0,1,2,3,4,5,6,7,8,9].map(i => <line key={`v${i}`} x1={i*38} y1="0" x2={i*38} y2="110" stroke="#C8C2B8" strokeWidth="1.1" />)}
                  <g transform={`scale(${343/88}, ${110/72})`}>
                    <path d={runDay.svgPath} stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </g>
                  {/* Start marker */}
                  {(() => {
                    const m = runDay.svgPath.match(/M\s*([\d.]+)\s+([\d.]+)/);
                    if (!m) return null;
                    return <circle cx={parseFloat(m[1]) * (343/88)} cy={parseFloat(m[2]) * (110/72)} r="7" fill={GOLD} stroke="#fff" strokeWidth="2" />;
                  })()}
                </svg>
              </div>

              {/* Info rows */}
              <div style={{ padding: "16px 18px" }}>
                <p style={{ color: NEAR_BLACK, fontSize: "17px", fontWeight: 800, letterSpacing: "-0.4px", marginBottom: "12px" }}>
                  {runDay.name}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "Distance", value: runDay.distance },
                    { label: "Avg Pace", value: runDay.pace.replace(" /mi", ""), unit: "/mi" },
                    { label: "Date",     value: `Jul ${selectedDay}` },
                  ].map(({ label, value, unit }) => (
                    <div key={label} style={{ background: "#EDE8DF", borderRadius: "12px", padding: "10px 10px", border: `1px solid rgba(110,100,88,0.1)` }}>
                      <p style={{ color: MUTED, fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{label}</p>
                      <p style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 800, letterSpacing: "-0.3px", lineHeight: 1 }}>{value}</p>
                      {unit && <p style={{ color: CHARCOAL, fontSize: "10px", marginTop: "2px" }}>{unit}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No run on selected day */
          <div>
            <p style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.2px", marginBottom: "10px" }}>
              July {selectedDay}
            </p>
            <div style={{ background: FIELD_BG, borderRadius: "20px", border: `1px solid rgba(110,100,88,0.12)`, padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#EDE8DF", border: `1px solid rgba(110,100,88,0.12)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke={MUTED} strokeWidth="1.6" />
                  <path d="M12 8V12M12 16H12.01" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 700 }}>No run logged</p>
              <p style={{ color: MUTED, fontSize: "13px", lineHeight: 1.5, maxWidth: "200px" }}>
                Rest day. Tap a run day to see your stats.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile tab ─────────────────────────────────────────────────────────────

function ProfileTab({ onLogOut }: { onLogOut: () => void }) {
  const SETTINGS = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={CHARCOAL} strokeWidth="1.7" />
          <path d="M4 20C4 17 7.58 14.5 12 14.5C16.42 14.5 20 17 20 20" stroke={CHARCOAL} strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ),
      label: "Account",
      sub: "sarah@example.com",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={CHARCOAL} strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M13.73 21C13.55 21.3 13.3 21.55 13 21.72C12.7 21.9 12.35 22 12 22C11.65 22 11.3 21.9 11 21.72C10.7 21.55 10.45 21.3 10.27 21" stroke={CHARCOAL} strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ),
      label: "Notifications",
      sub: "Push & email alerts",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={CHARCOAL} strokeWidth="1.7" />
          <path d="M12 8V12M12 16H12.01" stroke={CHARCOAL} strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ),
      label: "Help & Support",
      sub: "FAQs, contact us",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.5 5H17L14.5 7.5L15.5 11L12 9L8.5 11L9.5 7.5L7 5H10.5L12 2Z" stroke={CHARCOAL} strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M5 20H19" stroke={CHARCOAL} strokeWidth="1.7" strokeLinecap="round" />
          <path d="M12 13V20" stroke={CHARCOAL} strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ),
      label: "About Iter",
      sub: "Version 1.0.0",
    },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: CREAM_BG, overflowY: "auto" }}>

      {/* ── Hero / avatar ── */}
      <div style={{ padding: "24px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: `1px solid rgba(110,100,88,0.1)` }}>
        {/* Avatar ring */}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <div style={{ width: "82px", height: "82px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(213,160,33,0.2) 0%, rgba(213,160,33,0.08) 100%)", border: `2.5px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(213,160,33,0.2)" }}>
            <span style={{ color: GOLD, fontSize: "30px", fontWeight: 800, letterSpacing: "-1px" }}>S</span>
          </div>
          {/* Edit badge */}
          <button style={{ position: "absolute", bottom: 0, right: 0, width: "24px", height: "24px", borderRadius: "50%", background: GOLD, border: "2px solid #EDE8DF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M16.86 3.14a2 2 0 0 1 2.83 2.83L7.5 18.16l-4 1 1-4L16.86 3.14Z" fill="#1A1714" />
            </svg>
          </button>
        </div>

        <h1 style={{ color: NEAR_BLACK, fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "2px" }}>Sarah Chen</h1>
        <p style={{ color: MUTED, fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>Member since June 2026</p>

        {/* Iter badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(213,160,33,0.1)", border: `1px solid rgba(213,160,33,0.22)`, borderRadius: "99px", padding: "4px 12px" }}>
          <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
            <path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill={GOLD} />
          </svg>
          <span style={{ color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2px" }}>Iter Runner</span>
        </div>
      </div>

      {/* ── Stat tiles ── */}
      <div style={{ padding: "18px 16px 0" }}>
        <p style={{ color: MUTED, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "10px" }}>All-time stats</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "22px" }}>
          {[
            { label: "Total Miles", value: "84.3", unit: "mi" },
            { label: "Total Runs",  value: "27",   unit: "runs" },
            { label: "Longest",     value: "9.1",  unit: "mi" },
          ].map(({ label, value, unit }) => (
            <div key={label} style={{ background: FIELD_BG, borderRadius: "16px", padding: "14px 10px", border: `1px solid rgba(110,100,88,0.13)`, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <span style={{ color: MUTED, fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px", textAlign: "center" }}>{label}</span>
              <span style={{ color: NEAR_BLACK, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1 }}>{value}</span>
              <span style={{ color: CHARCOAL, fontSize: "10px", fontWeight: 500, marginTop: "3px" }}>{unit}</span>
            </div>
          ))}
        </div>

        {/* ── Settings list ── */}
        <p style={{ color: MUTED, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "10px" }}>Settings</p>
        <div style={{ background: FIELD_BG, borderRadius: "18px", border: `1px solid rgba(110,100,88,0.13)`, overflow: "hidden", marginBottom: "20px" }}>
          {SETTINGS.map(({ icon, label, sub }, i) => (
            <button
              key={label}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                background: "none",
                border: "none",
                borderBottom: i < SETTINGS.length - 1 ? `1px solid rgba(110,100,88,0.1)` : "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {/* Icon tile */}
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#EDE8DF", border: `1px solid rgba(110,100,88,0.12)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 600, letterSpacing: "-0.1px", marginBottom: "1px" }}>{label}</p>
                <p style={{ color: MUTED, fontSize: "12px", fontWeight: 400 }}>{sub}</p>
              </div>

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

        {/* ── Log Out ── */}
        <button
          onClick={onLogOut}
          style={{ width: "100%", height: "52px", borderRadius: "14px", background: "transparent", color: "#C0392B", fontSize: "15px", fontWeight: 600, border: `1.5px solid rgba(192,57,43,0.3)`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17L21 12L16 7M21 12H9" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Log Out
        </button>

        <p style={{ textAlign: "center", color: MUTED, fontSize: "11px", paddingBottom: "12px" }}>
          Iter · Version 1.0.0
        </p>
      </div>
    </div>
  );
}

// ─── Main app shell (post-auth) ───────────────────────────────────────────────

function MainApp({ onCreatePath, onStartRun }: { onCreatePath: () => void; onStartRun: () => void }) {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <>
      <StatusBar />
      {tab === "home"     && <HomeTab onCreatePath={onCreatePath} onStartRun={onStartRun} />}
      {tab === "paths"    && <SavedPathsTab onCreatePath={onCreatePath} />}
      {tab === "calendar" && <CalendarTab />}
      {tab === "profile"  && <ProfileTab onLogOut={() => {}} />}
      <TabBar active={tab} onChange={setTab} />
    </>
  );
}

// ─── Path Builder screen ─────────────────────────────────────────────────────

function haversine(a: [number, number], b: [number, number]): number {
  const R = 3958.8;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function PathBuilderScreen({ onBack }: { onBack: () => void }) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMap = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null);

  const [points, setPoints] = useState<[number, number][]>([]);
  const [locating, setLocating] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [pathName, setPathName] = useState("");

  const totalMiles = useMemo(() => {
    let d = 0;
    for (let i = 1; i < points.length; i++) d += haversine(points[i - 1], points[i]);
    return d;
  }, [points]);

  const canSave = points.length >= 2;

  // Bootstrap Leaflet imperatively — avoids all react-leaflet context issues
  useEffect(() => {
    if (!mapDivRef.current || leafletMap.current) return;

    // Dynamic import so Leaflet CSS + JS load together
    import("leaflet").then((Lmod) => {
      const L = Lmod.default ?? Lmod;
      if (!mapDivRef.current || leafletMap.current) return;

      const map = L.map(mapDivRef.current, {
        center: [40.7851, -73.9683],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(map);

      map.on("click", (e: L.LeafletMouseEvent) => {
        const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPoints((prev) => [...prev, pt]);
      });

      leafletMap.current = map;
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  // Sync markers + polyline whenever points change
  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;

    import("leaflet").then((Lmod) => {
      const L = Lmod.default ?? Lmod;

      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Remove old polyline
      polylineRef.current?.remove();
      polylineRef.current = null;

      // Draw polyline
      if (points.length > 1) {
        polylineRef.current = L.polyline(points, {
          color: GOLD,
          weight: 4,
          opacity: 0.92,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);
      }

      // Draw markers
      points.forEach((pt, i) => {
        const isStart = i === 0;
        const isEnd   = i === points.length - 1 && points.length > 1;
        const radius  = isStart || isEnd ? 8 : 5;
        const color   = isEnd ? "#fff" : GOLD;
        const stroke  = isEnd ? GOLD : "#fff";

        const marker = L.circleMarker(pt, {
          radius,
          fillColor: color,
          fillOpacity: 1,
          color: stroke,
          weight: 2.5,
        }).addTo(map);

        markersRef.current.push(marker);
      });
    });
  }, [points]);

  const handleLocate = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        leafletMap.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 16, { animate: true, duration: 1.2 });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const FloatBtn = ({
    onClick, children, disabled = false,
  }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "44px", height: "44px", borderRadius: "50%",
        background: "rgba(245,240,232,0.94)",
        border: "1px solid rgba(110,100,88,0.18)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.38 : 1,
        transition: "opacity 0.15s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

      {/* Map container — Leaflet mounts here */}
      <div ref={mapDivRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* ── Floating top bar ── */}
      <div style={{ position: "absolute", top: "16px", left: "12px", right: "12px", display: "flex", alignItems: "center", gap: "10px", zIndex: 1000 }}>
        <button
          onClick={onBack}
          style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(245,240,232,0.94)", border: "1px solid rgba(110,100,88,0.18)", backdropFilter: "blur(8px)", boxShadow: "0 2px 12px rgba(0,0,0,0.14)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke={NEAR_BLACK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1, background: "rgba(245,240,232,0.94)", backdropFilter: "blur(8px)", borderRadius: "14px", border: "1px solid rgba(110,100,88,0.18)", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", padding: "10px 16px" }}>
          <p style={{ color: MUTED, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1px" }}>Route Builder</p>
          <p style={{ color: NEAR_BLACK, fontSize: "15px", fontWeight: 700, letterSpacing: "-0.2px" }}>Create Path</p>
        </div>
      </div>

      {/* ── Stats pill ── */}
      <div style={{ position: "absolute", top: "88px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "rgba(245,240,232,0.94)", backdropFilter: "blur(8px)", borderRadius: "99px", border: "1px solid rgba(110,100,88,0.18)", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", padding: "7px 18px", display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <span style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 800, letterSpacing: "-0.3px" }}>{totalMiles.toFixed(2)} mi</span>
        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: MUTED, display: "inline-block" }} />
        <span style={{ color: MUTED, fontSize: "13px", fontWeight: 600 }}>{points.length} {points.length === 1 ? "point" : "points"}</span>
        {points.length === 0 && (
          <>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: MUTED, display: "inline-block" }} />
            <span style={{ color: MUTED, fontSize: "12px", fontWeight: 500 }}>Tap map to begin</span>
          </>
        )}
      </div>

      {/* ── Right-side action buttons ── */}
      <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "10px", zIndex: 1000 }}>
        <FloatBtn onClick={handleLocate}>
          {locating ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
              <circle cx="12" cy="12" r="9" stroke={MUTED} strokeWidth="2" strokeDasharray="28 56" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3.5" fill={GOLD} />
              <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke={NEAR_BLACK} strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="12" r="7" stroke={NEAR_BLACK} strokeWidth="1.8" />
            </svg>
          )}
        </FloatBtn>
        <FloatBtn onClick={() => setPoints((p) => p.slice(0, -1))} disabled={points.length === 0}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 14L4 9L9 4" stroke={NEAR_BLACK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 9H14.5C17.537 9 20 11.462 20 14.5C20 17.537 17.537 20 14.5 20H11" stroke={NEAR_BLACK} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </FloatBtn>
        <FloatBtn onClick={() => setPoints([])} disabled={points.length === 0}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M8 6V4H16V6M19 6L18.08 19.13C17.95 20.19 17.06 21 15.99 21H8.01C6.94 21 6.05 20.19 5.92 19.13L5 6" stroke={NEAR_BLACK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </FloatBtn>
      </div>

      {/* ── Save button ── */}
      <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", padding: "16px 16px 28px", background: "linear-gradient(to top, rgba(237,232,223,0.98) 60%, transparent)", zIndex: 1000 }}>
        <button
          disabled={!canSave}
          onClick={() => {
            if (!canSave) return;
            setSheetOpen(true);
            requestAnimationFrame(() => setSheetVisible(true));
          }}
          style={{ width: "100%", height: "54px", borderRadius: "16px", background: canSave ? GOLD : "rgba(110,100,88,0.18)", color: canSave ? "#1A1714" : MUTED, fontSize: "16px", fontWeight: 700, letterSpacing: "0.1px", border: "none", cursor: canSave ? "pointer" : "default", boxShadow: canSave ? "0 4px 20px rgba(213,160,33,0.32)" : "none", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          {canSave ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16L21 8V19C21 20.1 20.1 21 19 21Z" stroke="#1A1714" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 21V13H7V21M7 3V8H15" stroke="#1A1714" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Save Path
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke={MUTED} strokeWidth="1.6" />
                <path d="M12 8V12M12 16H12.01" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Add {Math.max(0, 2 - points.length)} more {2 - points.length === 1 ? "point" : "points"} to save
            </>
          )}
        </button>
      </div>

      {/* ── Save Path bottom sheet ── */}
      {sheetOpen && (
        <>
          {/* Scrim */}
          <div
            onClick={() => {
              setSheetVisible(false);
              setTimeout(() => setSheetOpen(false), 320);
            }}
            style={{
              position: "absolute", inset: 0, zIndex: 1100,
              background: "rgba(26,23,20,0.45)",
              backdropFilter: "blur(2px)",
              opacity: sheetVisible ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />

          {/* Sheet panel */}
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              zIndex: 1200,
              background: "#F5F0E8",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
              padding: "0 0 36px",
              transform: sheetVisible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "99px", background: "rgba(110,100,88,0.25)" }} />
            </div>

            <div style={{ padding: "16px 24px 0" }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ color: NEAR_BLACK, fontSize: "20px", fontWeight: 700, letterSpacing: "-0.4px" }}>
                  Name your path
                </h2>
                {/* Iter mark */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px", opacity: 0.4 }}>
                  <svg width="10" height="13" viewBox="0 0 32 40" fill="none">
                    <path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill={CHARCOAL} />
                  </svg>
                  <span style={{ color: CHARCOAL, fontSize: "12px", fontWeight: 700, letterSpacing: "-0.3px" }}>iter</span>
                </div>
              </div>

              {/* Name input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: LABEL, fontSize: "13px", fontWeight: 600, marginBottom: "7px", letterSpacing: "0.1px" }}>
                  Path name
                </label>
                <div style={{ display: "flex", alignItems: "center", background: "#EDE8DF", borderRadius: "12px", border: `1.5px solid rgba(110,100,88,0.2)`, padding: "0 14px", height: "50px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginRight: "10px" }}>
                    <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z" fill={MUTED} />
                  </svg>
                  <input
                    type="text"
                    placeholder="Morning Run"
                    value={pathName}
                    onChange={(e) => setPathName(e.target.value)}
                    autoFocus
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: NEAR_BLACK, fontSize: "16px", fontWeight: 500 }}
                  />
                </div>
              </div>

              {/* Route preview strip */}
              <div
                style={{
                  background: "#EDE8DF",
                  borderRadius: "14px",
                  border: `1px solid rgba(110,100,88,0.14)`,
                  padding: "13px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                {/* Mini route line graphic */}
                <svg width="48" height="32" viewBox="0 0 48 32" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="4" cy="16" r="4" fill={GOLD} />
                  <circle cx="4" cy="16" r="6.5" fill="none" stroke={GOLD} strokeWidth="1" strokeOpacity="0.3" />
                  <path d="M8 16 C14 6, 22 26, 30 14 C36 6, 40 20, 44 16" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="44" cy="16" r="4" fill="#fff" stroke={GOLD} strokeWidth="2.5" />
                </svg>

                <div style={{ flex: 1 }}>
                  <p style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}>
                    {pathName.trim() || "Morning Run"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: MUTED, fontSize: "12px", fontWeight: 500 }}>
                      {totalMiles.toFixed(2)} mi
                    </span>
                    <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: MUTED, display: "inline-block" }} />
                    <span style={{ color: MUTED, fontSize: "12px", fontWeight: 500 }}>
                      {points.length} points
                    </span>
                  </div>
                </div>

                {/* Gold check badge */}
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(213,160,33,0.12)", border: `1.5px solid rgba(213,160,33,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => {
                    setSheetVisible(false);
                    setTimeout(() => { setSheetOpen(false); setPathName(""); }, 320);
                  }}
                  style={{ flex: 1, height: "52px", borderRadius: "14px", background: "transparent", color: NEAR_BLACK, fontSize: "15px", fontWeight: 600, border: `1.5px solid rgba(110,100,88,0.3)`, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSheetVisible(false);
                    setTimeout(() => { setSheetOpen(false); setPathName(""); setPoints([]); }, 320);
                  }}
                  style={{ flex: 1, height: "52px", borderRadius: "14px", background: GOLD, color: "#1A1714", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(213,160,33,0.32)" }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Run flow shared data ─────────────────────────────────────────────────────

// Central Park loop — real lat/lng used by both RunInProgress and RunComplete
const CP_ROUTE: [number, number][] = [
  [40.7851, -73.9683], [40.7842, -73.9703], [40.7825, -73.9715],
  [40.7808, -73.9700], [40.7795, -73.9668], [40.7800, -73.9635],
  [40.7815, -73.9610], [40.7838, -73.9601], [40.7858, -73.9618],
  [40.7868, -73.9648], [40.7862, -73.9672], [40.7851, -73.9683],
];

// Normalised SVG path (0–88 × 0–72) matching the CP_ROUTE shape
const CP_SVG =
  "M 44 8 C 36 8, 28 14, 22 22 C 16 30, 14 40, 18 50 C 22 60, 32 66, 44 64 C 56 62, 66 56, 70 46 C 74 36, 72 24, 66 16 C 60 8, 52 8, 44 8 Z";

type SavedPath = typeof SAVED_PATHS[0];
interface RunStats { elapsed: number; distance: string; pace: string; path: SavedPath }

// ─── Screen 1: Start a Run ────────────────────────────────────────────────────

function StartRunScreen({ onBack, onStart }: { onBack: () => void; onStart: (p: SavedPath) => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: CREAM_BG }}>
      <StatusBar />
      <NavRow onBack={onBack} />

      <div style={{ padding: "12px 20px 0", flexShrink: 0 }}>
        <h1 style={{ color: NEAR_BLACK, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.6px", marginBottom: "4px" }}>
          Choose a path to run
        </h1>
        <p style={{ color: MUTED, fontSize: "13px", marginBottom: "16px" }}>
          Pick a saved route and hit Start.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 28px" }}>
        {SAVED_PATHS.map((path) => (
          <div
            key={path.id}
            style={{ display: "flex", alignItems: "center", gap: "12px", background: FIELD_BG, border: `1.5px solid rgba(110,100,88,0.14)`, borderRadius: "18px", padding: "12px 12px 12px 12px", marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div style={{ flexShrink: 0, borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>
              <RouteThumbnail path={path.svgPath} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.2px", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {path.name}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ color: NEAR_BLACK, fontSize: "14px", fontWeight: 800 }}>{path.distance}</span>
                <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: MUTED, display: "inline-block" }} />
                <span style={{ color: MUTED, fontSize: "12px", fontWeight: 500 }}>{path.points} pts</span>
              </div>
            </div>

            <button
              onClick={() => onStart(path)}
              style={{ flexShrink: 0, height: "36px", paddingLeft: "16px", paddingRight: "16px", borderRadius: "99px", background: GOLD, color: "#1A1714", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 3px 12px rgba(213,160,33,0.3)", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap" }}
            >
              <svg width="11" height="14" viewBox="0 0 32 40" fill="none">
                <path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill="#1A1714" />
              </svg>
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen 2: Run in Progress ────────────────────────────────────────────────

function RunInProgressScreen({ path, onStop }: { path: SavedPath; onStop: (stats: RunStats) => void }) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const grayPolyRef = useRef<any>(null);
  const goldPolyRef = useRef<any>(null);
  const gpsMarkerRef = useRef<any>(null);

  const [elapsed, setElapsed] = useState(0);
  const TOTAL_TICKS = 60; // full route covered in 60 ticks (demo speed)

  const progress = Math.min(elapsed / TOTAL_TICKS, 1);
  const coveredPoints = Math.max(2, Math.round(progress * CP_ROUTE.length));
  const distanceMi = (progress * parseFloat(path.distance)).toFixed(2);
  const paceStr = elapsed > 3
    ? `${Math.floor(parseFloat(path.distance) / (elapsed / 60))}:${String(Math.round((parseFloat(path.distance) / (elapsed / 60) % 1) * 60)).padStart(2, "0")}`
    : "--:--";
  const timeStr = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Init map
  useEffect(() => {
    if (!mapDivRef.current || leafletMap.current) return;
    import("leaflet").then((Lmod) => {
      const L = Lmod.default ?? Lmod;
      if (!mapDivRef.current || leafletMap.current) return;

      const map = L.map(mapDivRef.current, {
        center: [40.7830, -73.9655],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);

      // Full route in light gray
      grayPolyRef.current = L.polyline(CP_ROUTE, { color: "#C0B8AE", weight: 4, opacity: 0.7, lineCap: "round" }).addTo(map);

      // Traveled portion in gold (starts with 2 pts)
      goldPolyRef.current = L.polyline(CP_ROUTE.slice(0, 2), { color: GOLD, weight: 5, opacity: 0.95, lineCap: "round" }).addTo(map);

      // GPS dot
      const gpsDot = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${GOLD};border:2.5px solid #fff;box-shadow:0 0 0 4px rgba(213,160,33,0.25),0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      });
      gpsMarkerRef.current = L.marker(CP_ROUTE[0], { icon: gpsDot }).addTo(map);

      // Start marker
      L.circleMarker(CP_ROUTE[0], { radius: 7, fillColor: GOLD, fillOpacity: 1, color: "#fff", weight: 2.5 }).addTo(map);

      leafletMap.current = map;
    });
    return () => { leafletMap.current?.remove(); leafletMap.current = null; };
  }, []);

  // Update gold line + GPS dot on every tick
  useEffect(() => {
    if (!goldPolyRef.current) return;
    goldPolyRef.current.setLatLngs(CP_ROUTE.slice(0, coveredPoints));
    const gpsPt = CP_ROUTE[Math.min(coveredPoints - 1, CP_ROUTE.length - 1)];
    gpsMarkerRef.current?.setLatLng(gpsPt);
  }, [coveredPoints]);

  const handleStop = () => {
    onStop({
      elapsed,
      distance: distanceMi,
      pace: paceStr,
      path,
    });
  };

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <div ref={mapDivRef} style={{ position: "absolute", inset: 0 }} />

      {/* Top: route name pill */}
      <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "rgba(245,240,232,0.94)", backdropFilter: "blur(8px)", borderRadius: "99px", border: "1px solid rgba(110,100,88,0.18)", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", padding: "6px 16px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "7px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E53935", boxShadow: "0 0 0 3px rgba(229,57,53,0.2)" }} />
        <span style={{ color: NEAR_BLACK, fontSize: "13px", fontWeight: 700 }}>{path.name}</span>
      </div>

      {/* Stats card */}
      <div style={{ position: "absolute", top: "64px", left: "16px", right: "16px", zIndex: 1000, background: "rgba(245,240,232,0.96)", backdropFilter: "blur(12px)", borderRadius: "20px", border: "1px solid rgba(110,100,88,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", padding: "16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          {[
            { label: "Time", value: timeStr },
            { label: "Distance", value: `${distanceMi} mi` },
            { label: "Pace", value: elapsed > 5 ? paceStr : "--:--" },
          ].map(({ label, value }, i) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: i < 2 ? "1px solid rgba(110,100,88,0.12)" : "none" }}>
              <span style={{ color: MUTED, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "4px" }}>{label}</span>
              <span style={{ color: NEAR_BLACK, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1 }}>{value.split(" ")[0]}</span>
              {value.includes(" ") && <span style={{ color: CHARCOAL, fontSize: "11px", fontWeight: 500, marginTop: "2px" }}>{value.split(" ")[1]}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", top: "168px", left: "16px", right: "16px", zIndex: 1000 }}>
        <div style={{ height: "3px", borderRadius: "2px", background: "rgba(245,240,232,0.5)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: GOLD, borderRadius: "2px", transition: "width 0.9s ease" }} />
        </div>
      </div>

      {/* Stop button */}
      <div style={{ position: "absolute", bottom: "44px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <button
          onClick={handleStop}
          style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#E53935", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(229,57,53,0.45), 0 0 0 6px rgba(229,57,53,0.12)", transition: "transform 0.1s" }}
        >
          <div style={{ width: "22px", height: "22px", borderRadius: "4px", background: "#fff" }} />
        </button>
        <span style={{ color: "rgba(245,240,232,0.85)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>Stop</span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Screen 3: Run Complete ───────────────────────────────────────────────────

function RunCompleteScreen({ stats, onDone }: { stats: RunStats; onDone: () => void }) {
  const mins = Math.floor(stats.elapsed / 60);
  const secs = stats.elapsed % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, "0")}`;
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const avgPace = stats.elapsed > 0 && parseFloat(stats.distance) > 0
    ? `${Math.floor(stats.elapsed / 60 / parseFloat(stats.distance))}:${String(Math.round((stats.elapsed / 60 / parseFloat(stats.distance) % 1) * 60)).padStart(2, "0")}`
    : "--:--";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: CREAM_BG, overflowY: "auto" }}>
      <StatusBar />

      {/* Map snapshot card */}
      <div style={{ margin: "12px 16px 0", borderRadius: "22px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.14)" }}>
        <svg width="100%" viewBox="0 0 343 220" fill="none" style={{ display: "block" }}>
          <rect width="343" height="220" fill="#D8D3CA" />
          {/* Street grid */}
          {[0,1,2,3,4,5,6,7,8].map(i => <line key={`h${i}`} x1="0" y1={i*28} x2="343" y2={i*28} stroke="#C8C2B8" strokeWidth="1.2" />)}
          {[0,1,2,3,4,5,6,7,8,9].map(i => <line key={`v${i}`} x1={i*38} y1="0" x2={i*38} y2="220" stroke="#C8C2B8" strokeWidth="1.2" />)}
          {/* Full gray planned route (scaled 88→343, 72→220) */}
          <g transform={`scale(${343/88}, ${220/72})`}>
            <path d={CP_SVG} stroke="#C0B8AE" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
          {/* Gold completed route */}
          <g transform={`scale(${343/88}, ${220/72})`}>
            <path d={stats.path.svgPath} stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
          {/* Gradient overlay at bottom for label legibility */}
          <defs>
            <linearGradient id="mapFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="60%" stopColor="#D8D3CA" stopOpacity="0" />
              <stop offset="100%" stopColor="#1A1714" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <rect width="343" height="220" fill="url(#mapFade)" />
          {/* Start/end markers scaled */}
          <circle cx={44 * (343/88)} cy={8 * (220/72)} r="9" fill={GOLD} stroke="#fff" strokeWidth="2.5" />
          <circle cx={44 * (343/88)} cy={8 * (220/72)} r="14" fill="none" stroke={GOLD} strokeWidth="1" strokeOpacity="0.3" />
          <circle cx={44 * (343/88)} cy={64 * (220/72)} r="9" fill="#fff" stroke={GOLD} strokeWidth="2.5" />
          {/* Bottom label */}
          <text x="16" y="204" fill="rgba(245,240,232,0.9)" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">{stats.path.name}</text>
          <text x="327" y="204" fill="rgba(245,240,232,0.7)" fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif" textAnchor="end">{today}</text>
        </svg>
      </div>

      {/* Congratulations */}
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <p style={{ color: MUTED, fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>Run Complete</p>
        <h1 style={{ color: NEAR_BLACK, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.6px", marginBottom: "2px" }}>
          Great work! 🎉
        </h1>
        <p style={{ color: MUTED, fontSize: "14px" }}>You crushed the {stats.path.name}.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "20px 16px 0" }}>
        {[
          { label: "Distance", value: `${stats.distance}`, unit: "mi" },
          { label: "Time",     value: timeStr,              unit: "min" },
          { label: "Avg Pace", value: avgPace,              unit: "/mi" },
          { label: "Date",     value: today,                unit: "" },
        ].map(({ label, value, unit }) => (
          <div key={label} style={{ background: FIELD_BG, borderRadius: "16px", padding: "16px 16px", border: `1px solid rgba(110,100,88,0.13)`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <p style={{ color: MUTED, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>{label}</p>
            <p style={{ color: NEAR_BLACK, fontSize: label === "Date" ? "14px" : "26px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</p>
            {unit && <p style={{ color: CHARCOAL, fontSize: "11px", fontWeight: 500, marginTop: "3px" }}>{unit}</p>}
          </div>
        ))}
      </div>

      {/* Personal best badge */}
      <div style={{ margin: "16px 16px 0", background: "rgba(213,160,33,0.08)", border: `1px solid rgba(213,160,33,0.25)`, borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(213,160,33,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={GOLD} />
          </svg>
        </div>
        <div>
          <p style={{ color: GOLD, fontSize: "12px", fontWeight: 700, marginBottom: "1px" }}>Personal Best</p>
          <p style={{ color: CHARCOAL, fontSize: "12px", fontWeight: 500 }}>Fastest {stats.path.name} yet!</p>
        </div>
      </div>

      {/* Done button */}
      <div style={{ padding: "24px 16px 40px" }}>
        <button
          onClick={onDone}
          style={{ width: "100%", height: "54px", borderRadius: "16px", background: GOLD, color: "#1A1714", fontSize: "16px", fontWeight: 700, letterSpacing: "0.1px", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(213,160,33,0.32)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#1A1714" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done — Save to Calendar
        </button>
      </div>
    </div>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────

type Screen = "welcome" | "signin" | "signup" | "verify" | "forgot" | "check-email" | "set-password" | "app" | "path-builder" | "start-run" | "run-progress" | "run-complete";

export default function App() {
  const [screen, setScreen] = useState<Screen>("app");
  const [runPath, setRunPath] = useState<SavedPath | null>(null);
  const [runStats, setRunStats] = useState<RunStats | null>(null);

  const isDark = screen === "welcome";
  const isMapScreen = screen === "path-builder" || screen === "run-progress";
  const phoneBg = isDark ? "#1A1714" : isMapScreen ? "#d4d0ca" : CREAM_BG;

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#EDEAE4", fontFamily: "'Inter', sans-serif" }}>
      <div
        className="relative flex flex-col"
        style={{ width: "375px", minHeight: "812px", background: phoneBg, overflow: "hidden", borderRadius: "40px", boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.1)", transition: "background 0.3s ease" }}
      >
        {screen === "welcome"      && <WelcomeScreen onLogin={() => setScreen("signin")} onSignUp={() => setScreen("signup")} />}
        {screen === "signin"       && <SignInScreen onBack={() => setScreen("welcome")} onForgot={() => setScreen("forgot")} onSignUp={() => setScreen("signup")} />}
        {screen === "signup"       && <SignUpScreen onBack={() => setScreen("welcome")} onSignIn={() => setScreen("signin")} />}
        {screen === "verify"       && <VerifyEmailScreen onBack={() => setScreen("signup")} onVerified={() => setScreen("signin")} />}
        {screen === "forgot"       && <ForgotPasswordScreen onBack={() => setScreen("signin")} onSend={() => setScreen("check-email")} />}
        {screen === "check-email"  && <CheckEmailScreen onBack={() => setScreen("signin")} />}
        {screen === "set-password" && <SetPasswordScreen onDone={() => setScreen("signin")} />}
        {screen === "app"          && <MainApp onCreatePath={() => setScreen("path-builder")} onStartRun={() => setScreen("start-run")} />}
        {screen === "path-builder" && <PathBuilderScreen onBack={() => setScreen("app")} />}
        {screen === "start-run"    && <StartRunScreen onBack={() => setScreen("app")} onStart={(p) => { setRunPath(p); setScreen("run-progress"); }} />}
        {screen === "run-progress" && runPath && <RunInProgressScreen path={runPath} onStop={(s) => { setRunStats(s); setScreen("run-complete"); }} />}
        {screen === "run-complete" && runStats && <RunCompleteScreen stats={runStats} onDone={() => setScreen("app")} />}
      </div>

      {/* Dev nav */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 justify-center" style={{ maxWidth: "600px" }}>
        {(["welcome","signin","signup","verify","forgot","check-email","set-password","app","path-builder","start-run","run-progress","run-complete"] as Screen[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              if (s === "run-progress" && !runPath) setRunPath(SAVED_PATHS[0]);
              if (s === "run-complete" && !runStats) setRunStats({ elapsed: 1823, distance: "3.14", pace: "9:41", path: SAVED_PATHS[0] });
              setScreen(s);
            }}
            style={{ padding: "5px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: "pointer", border: "none", background: screen === s ? GOLD : "rgba(0,0,0,0.12)", color: screen === s ? "#1A1714" : "#6E6458", transition: "all 0.15s ease" }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
