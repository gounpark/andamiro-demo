import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ChevronLeft, Users, Lock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/exchange-diary-join")({
  head: () => ({
    meta: [
      { title: "교환일기 참여 — 안다미로" },
      { name: "theme-color", content: "#ffffff" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { step?: string } => ({
    step: typeof search.step === "string" ? search.step : "invite",
  }),
  component: ExchangeDiaryJoinPage,
});

const ROOM_INFO = {
  name: "봄날의 우리들",
  memberCount: 3,
  inviter: "박고운",
};

const CORRECT_PIN = "1234";

function ExchangeDiaryJoinPage() {
  const navigate = useNavigate();
  const { step } = Route.useSearch();

  if (step === "success") return <SuccessStep />;
  if (step === "password") return <PasswordStep navigate={navigate} />;
  return <InviteStep navigate={navigate} />;
}

function InviteStep({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="app-shell">
      <div className="app-frame flex flex-col" style={{ background: "#f5f6f8" }}>
        <header className="relative shrink-0 flex items-center justify-center px-4 pt-[52px] pb-3 bg-white border-b border-[#f5f5f5]">
          <Link
            to="/exchange-diary"
            aria-label="뒤로"
            className="absolute left-3 top-[50px] grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <h1 className="font-semibold text-foreground text-[16px] tracking-tight">초대장</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
          {/* 초대 아이콘 */}
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[var(--primary)]/10 mb-6">
            <Users className="h-9 w-9 text-[var(--primary)]" />
          </div>

          {/* 안내 텍스트 */}
          <p className="text-[14px] text-foreground/60 tracking-tight mb-1 text-center">
            <span className="font-semibold text-foreground">{ROOM_INFO.inviter}</span>님이 교환일기에 초대했어요
          </p>
          <h2 className="text-[22px] font-bold text-foreground tracking-tight text-center mt-1">
            {ROOM_INFO.name}
          </h2>

          {/* 방 정보 카드 */}
          <div className="mt-6 w-full rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-[#999] tracking-tight">일기장 이름</span>
              <span className="text-[14px] font-semibold text-foreground tracking-tight">{ROOM_INFO.name}</span>
            </div>
            <div className="h-px bg-[#f5f5f5] mb-3" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-[#999] tracking-tight">초대한 친구</span>
              <span className="text-[14px] font-semibold text-foreground tracking-tight">{ROOM_INFO.inviter}</span>
            </div>
            <div className="h-px bg-[#f5f5f5] mb-3" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#999] tracking-tight">현재 참여자</span>
              <span className="text-[14px] font-semibold text-foreground tracking-tight">{ROOM_INFO.memberCount}명</span>
            </div>
          </div>

          {/* 참여하기 버튼 */}
          <button
            type="button"
            onClick={() => navigate({ to: "/exchange-diary-join", search: { step: "password" } })}
            className="mt-6 w-full flex items-center justify-center rounded-2xl bg-[var(--primary)] py-3.5 font-semibold text-white text-[15px] tracking-tight shadow-md active:scale-[0.99] transition"
          >
            참여하기
          </button>
          <Link
            to="/exchange-diary"
            className="mt-3 text-[13px] text-[#999] tracking-tight active:text-foreground"
          >
            취소
          </Link>
        </div>
      </div>
    </div>
  );
}

function PasswordStep({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  function handlePinChange(index: number, value: string) {
    const digit = value.replace(/\D/, "").slice(-1);
    const next = [...pin];
    next[index] = digit;
    setPin(next);
    setError(false);
    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }

  function handleConfirm() {
    if (pin.join("") === CORRECT_PIN) {
      navigate({ to: "/exchange-diary-join", search: { step: "success" } });
    } else {
      setError(true);
      setPin(["", "", "", ""]);
      inputRefs[0].current?.focus();
    }
  }

  const filled = pin.every(Boolean);

  return (
    <div className="app-shell">
      <div className="app-frame flex flex-col" style={{ background: "#f5f6f8" }}>
        <header className="relative shrink-0 flex items-center justify-center px-4 pt-[52px] pb-3 bg-white border-b border-[#f5f5f5]">
          <button
            type="button"
            aria-label="뒤로"
            onClick={() => navigate({ to: "/exchange-diary-join", search: { step: "invite" } })}
            className="absolute left-3 top-[50px] grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </button>
          <h1 className="font-semibold text-foreground text-[16px] tracking-tight">비밀번호 입력</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
          {/* 자물쇠 아이콘 */}
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[var(--primary)]/10 mb-6">
            <Lock className="h-9 w-9 text-[var(--primary)]" />
          </div>

          <h2 className="text-[20px] font-bold text-foreground tracking-tight text-center">
            {ROOM_INFO.name}
          </h2>
          <p className="mt-2 text-[14px] text-foreground/55 tracking-tight text-center">
            일기장의 비밀번호 4자리를 입력해주세요
          </p>

          {/* PIN 입력 */}
          <div className="mt-8 flex gap-3">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`h-14 w-14 rounded-2xl border text-center text-[22px] font-bold tracking-tight outline-none transition ${
                  error
                    ? "border-red-400 bg-red-50 text-red-500"
                    : digit
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-[#e8e8e8] bg-white text-foreground"
                } focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20`}
              />
            ))}
          </div>

          {error && (
            <p className="mt-3 text-[13px] text-red-500 tracking-tight">비밀번호가 올바르지 않아요. 다시 시도해주세요.</p>
          )}

          <p className="mt-3 text-[12px] text-[#bbb] tracking-tight">힌트: 1234</p>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!filled}
            className="mt-8 w-full flex items-center justify-center rounded-2xl bg-[var(--primary)] py-3.5 font-semibold text-white text-[15px] tracking-tight shadow-md active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessStep() {
  return (
    <div className="app-shell">
      <div className="app-frame flex flex-col items-center justify-center" style={{ background: "#f5f6f8" }}>
        <div className="px-6 flex flex-col items-center text-center">
          {/* 성공 아이콘 */}
          <div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--primary)]/10 mb-6">
            <CheckCircle2 className="h-12 w-12 text-[var(--primary)]" />
          </div>

          <h2 className="text-[24px] font-bold text-foreground tracking-tight">입장 완료!</h2>
          <p className="mt-2 text-[14px] text-foreground/60 tracking-tight">
            <span className="font-semibold text-foreground">{ROOM_INFO.name}</span>에 입장했어요.
          </p>
          <p className="mt-1 text-[14px] text-foreground/60 tracking-tight">
            함께 일기를 써봐요 ✍️
          </p>

          {/* 일기장으로 이동 버튼 */}
          <Link
            to="/exchange-diary-room"
            search={{ roomId: 1 }}
            className="mt-10 w-full flex items-center justify-center rounded-2xl bg-[var(--primary)] py-3.5 font-semibold text-white text-[15px] tracking-tight shadow-md active:scale-[0.99] transition"
          >
            일기장으로 이동
          </Link>
          <Link
            to="/exchange-diary"
            className="mt-3 text-[13px] text-[#999] tracking-tight active:text-foreground"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
