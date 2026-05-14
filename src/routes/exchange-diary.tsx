import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";

export const Route = createFileRoute("/exchange-diary")({
  head: () => ({
    meta: [
      { title: "교환 일기장 — 안다미로" },
      { name: "description", content: "친구들과 함께 쓰는 교환 일기장입니다." },
      { name: "theme-color", content: "#ffffff" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { published?: boolean } => ({
    published: search.published === true || search.published === "true",
  }),
  component: ExchangeDiaryPage,
});

type Room = {
  id: number;
  name: string;
  memberCount: number;
  lastEntry: string;
  lastActivityAt: string;
};

const DUMMY_ROOMS: Room[] = [
  {
    id: 1,
    name: "봄날의 우리들",
    memberCount: 3,
    lastEntry: "오늘 하루도 차분하게 흘러갔어요. 특별한 일은 없었지만 그래도...",
    lastActivityAt: "방금",
  },
  {
    id: 2,
    name: "일상 기록단",
    memberCount: 2,
    lastEntry: "드디어 프로젝트가 마무리됐다. 오랫동안 고생했는데 뿌듯하다.",
    lastActivityAt: "2시간 전",
  },
];

function ExchangeDiaryPage() {
  const navigate = useNavigate();
  const { published } = Route.useSearch();
  const [showToast, setShowToast] = useState(false);
  const [hasRooms] = useState(true);

  useEffect(() => {
    if (published) {
      setShowToast(true);
      const t = setTimeout(() => {
        setShowToast(false);
        navigate({ to: "/exchange-diary", search: {} });
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [published, navigate]);

  return (
    <div className="app-shell">
      <div className="app-frame flex flex-col" style={{ background: "#f5f6f8" }}>
        {/* 헤더 */}
        <header className="relative shrink-0 flex items-center justify-between px-4 pt-[52px] pb-3 bg-white border-b border-[#f5f5f5]">
          <Link
            to="/my"
            aria-label="뒤로"
            className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <h1 className="font-semibold text-foreground text-[16px] tracking-tight">교환 일기장</h1>
          <Link
            to="/exchange-diary-join"
            search={{ step: "invite" }}
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f6fa] text-foreground/60 hover:text-foreground active:scale-[0.97] transition"
          >
            <Plus className="h-5 w-5" strokeWidth={2.2} />
          </Link>
        </header>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto">
          {hasRooms ? (
            <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
              {DUMMY_ROOMS.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* 게시 완료 토스트 */}
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white shadow-lg transition-all duration-300 whitespace-nowrap ${
            showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          일기가 게시되었어요 ✓
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      to="/exchange-diary-room"
      search={{ roomId: room.id }}
      className="block rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99] transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground text-[15px] tracking-tight truncate">{room.name}</h2>
            <span className="shrink-0 flex items-center gap-0.5 text-[11px] text-[#999]">
              <Users className="h-3 w-3" />
              {room.memberCount}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-foreground/60 leading-[1.5] line-clamp-2 tracking-tight">
            {room.lastEntry}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-[#cbcbd1] shrink-0 mt-0.5" strokeWidth={2.2} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-[#bbb]">최근 활동 {room.lastActivityAt}</span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-32 px-8 gap-4">
      <p className="text-[16px] text-foreground/50 tracking-tight text-center">아직 일기장이 없어요 😢</p>
      <Link
        to="/exchange-diary-join"
        search={{ step: "invite" }}
        className="mt-2 flex items-center justify-center rounded-2xl bg-[var(--primary)] px-6 py-3.5 font-semibold text-white text-[15px] tracking-tight shadow-md active:scale-[0.99] transition"
      >
        새 교환일기 방 만들기
      </Link>
    </div>
  );
}
