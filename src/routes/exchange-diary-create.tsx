import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ChevronLeft, X, Link2, Check } from "lucide-react";

export const Route = createFileRoute("/exchange-diary-create")({
  head: () => ({
    meta: [
      { title: "교환일기 방 만들기 — 안다미로" },
      { name: "theme-color", content: "#ffffff" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { step?: string } => ({
    step: typeof search.step === "string" ? search.step : "name",
  }),
  component: ExchangeDiaryCreatePage,
});

function ExchangeDiaryCreatePage() {
  const { step } = Route.useSearch();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);

  if (step === "done") return <DoneStep roomName={roomName || "새 일기장"} />;
  if (step === "password")
    return (
      <PasswordStep
        roomName={roomName}
        pin={pin}
        setPin={setPin}
        onNext={() => navigate({ to: "/exchange-diary-create", search: { step: "done" } })}
        onBack={() => navigate({ to: "/exchange-diary-create", search: { step: "name" } })}
      />
    );
  return (
    <NameStep
      roomName={roomName}
      setRoomName={setRoomName}
      onNext={() => navigate({ to: "/exchange-diary-create", search: { step: "password" } })}
    />
  );
}

function NameStep({
  roomName,
  setRoomName,
  onNext,
}: {
  roomName: string;
  setRoomName: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="app-shell">
      <div className="app-frame flex flex-col" style={{ background: "#f5f6f8" }}>
        <header className="relative shrink-0 flex items-center justify-center px-4 pt-[52px] pb-3 bg-white border-b border-[#f5f5f5]">
          <Link
            to="/exchange-diary"
            aria-label="뒤로"
            className="absolute left-3 top-[50px] grid h-9 w-9 place-items-center rounded-full text-foreground/70"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <h1 className="font-semibold text-foreground text-[16px] tracking-tight">방 만들기</h1>
        </header>

        {/* 진행 바 */}
        <div className="h-1 bg-[#eef1f5]">
          <div className="h-full bg-[var(--primary)] transition-all duration-500" style={{ width: "33%" }} />
        </div>

        <div className="flex-1 flex flex-col px-6 pt-10">
          <p className="text-[13px] text-[#999] tracking-tight mb-1">1 / 2단계</p>
          <h2 className="font-bold text-foreground text-[20px] tracking-tight mb-1">
            일기장 이름을 정해주세요
          </h2>
          <p className="text-[13px] text-foreground/55 tracking-tight mb-8">
            함께 쓸 교환일기 방의 이름이에요
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="예) 봄날의 우리들"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              maxLength={20}
              autoFocus
              className="w-full rounded-2xl bg-white border border-[#e8e8e8] px-4 py-4 text-[16px] text-foreground tracking-tight outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 pr-10 shadow-sm"
            />
            {roomName && (
              <button
                type="button"
                onClick={() => setRoomName("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full bg-[#ccc] text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="mt-2 text-right text-[12px] text-[#bbb]">{roomName.length} / 20</p>
        </div>

        <div className="px-6 pb-10">
          <button
            type="button"
            onClick={onNext}
            disabled={!roomName.trim()}
            className="w-full flex items-center justify-center rounded-2xl bg-[var(--primary)] py-3.5 font-semibold text-white text-[15px] tracking-tight shadow-md active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordStep({
  roomName,
  pin,
  setPin,
  onNext,
  onBack,
}: {
  roomName: string;
  pin: string[];
  setPin: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/, "").slice(-1);
    const next = [...pin];
    next[index] = digit;
    setPin(next);
    if (digit && index < 3) inputRefs[index + 1].current?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
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
            onClick={onBack}
            className="absolute left-3 top-[50px] grid h-9 w-9 place-items-center rounded-full text-foreground/70"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </button>
          <h1 className="font-semibold text-foreground text-[16px] tracking-tight">방 만들기</h1>
        </header>

        {/* 진행 바 */}
        <div className="h-1 bg-[#eef1f5]">
          <div className="h-full bg-[var(--primary)] transition-all duration-500" style={{ width: "66%" }} />
        </div>

        <div className="flex-1 flex flex-col items-center px-6 pt-10">
          <div className="w-full mb-8">
            <p className="text-[13px] text-[#999] tracking-tight mb-1">2 / 2단계</p>
            <h2 className="font-bold text-foreground text-[20px] tracking-tight mb-1">
              비밀번호를 설정해주세요
            </h2>
            <p className="text-[13px] text-foreground/55 tracking-tight">
              <span className="font-semibold text-foreground">{roomName || "일기장"}</span>에 입장할 때 사용해요
            </p>
          </div>

          {/* PIN 입력 */}
          <div className="flex gap-3">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`h-14 w-14 rounded-2xl border text-center text-[22px] font-bold tracking-tight outline-none transition ${
                  digit
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-[#e8e8e8] bg-white text-foreground"
                } focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20`}
              />
            ))}
          </div>
          <p className="mt-3 text-[12px] text-[#bbb] tracking-tight">
            초대받은 친구들이 이 번호로 입장해요
          </p>
        </div>

        <div className="px-6 pb-10">
          <button
            type="button"
            onClick={onNext}
            disabled={!filled}
            className="w-full flex items-center justify-center rounded-2xl bg-[var(--primary)] py-3.5 font-semibold text-white text-[15px] tracking-tight shadow-md active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            방 만들기
          </button>
        </div>
      </div>
    </div>
  );
}

const FAKE_INVITE_LINK = "https://andamiro.app/join/abc123xyz";

function DoneStep({ roomName }: { roomName: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="app-shell">
      <div className="app-frame flex flex-col" style={{ background: "#f5f6f8" }}>
        {/* 진행 바 완료 */}
        <div className="h-1 bg-[var(--primary)]" />

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10 text-center">
          {/* 완료 아이콘 */}
          <div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--primary)]/10 mb-6">
            <Check className="h-12 w-12 text-[var(--primary)]" strokeWidth={2.5} />
          </div>

          <h2 className="text-[22px] font-bold text-foreground tracking-tight">
            일기장이 만들어졌어요!
          </h2>
          <p className="mt-2 text-[14px] text-foreground/60 tracking-tight">
            <span className="font-semibold text-foreground">{roomName}</span>에 친구를 초대해보세요
          </p>

          {/* 초대 링크 카드 */}
          <div className="mt-8 w-full rounded-2xl bg-white p-4 shadow-sm text-left">
            <p className="text-[12px] text-[#999] tracking-tight mb-2">초대 링크</p>
            <div className="flex items-center gap-2">
              <p className="flex-1 text-[13px] text-foreground/70 tracking-tight truncate font-mono">
                {FAKE_INVITE_LINK}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold tracking-tight transition active:scale-[0.97] ${
                  copied
                    ? "bg-[#e6f4ea] text-[#3d8c52]"
                    : "bg-[var(--primary)]/10 text-[var(--primary)]"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5" />
                    복사
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="mt-3 text-[12px] text-[#bbb] tracking-tight">
            링크를 받은 친구는 비밀번호를 입력해 입장할 수 있어요
          </p>
        </div>

        <div className="px-6 pb-10 flex flex-col gap-2.5">
          <Link
            to="/exchange-diary-room"
            search={{ roomId: 1 }}
            className="w-full flex items-center justify-center rounded-2xl bg-[var(--primary)] py-3.5 font-semibold text-white text-[15px] tracking-tight shadow-md active:scale-[0.99] transition"
          >
            일기장으로 이동
          </Link>
          <Link
            to="/exchange-diary"
            className="w-full flex items-center justify-center rounded-2xl bg-white py-3.5 font-semibold text-[var(--primary)] text-[15px] tracking-tight border border-[var(--primary)]/20 active:scale-[0.99] transition"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
