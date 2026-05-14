import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, FolderOpen, Plus, X } from "lucide-react";

export const Route = createFileRoute("/share-diary")({
  head: () => ({
    meta: [
      { title: "공유일기 작성 — 안다미로" },
      { name: "description", content: "AI가 작성한 일기 초안을 확인하고 수정해 교환일기에 게시하세요." },
      { name: "theme-color", content: "#ffffff" },
    ],
  }),
  component: ShareDiaryPage,
});

const AI_DRAFT = `오늘은 참 조용하고 평온한 하루였어요. 아침에 눈을 떴을 때 창문 너머로 햇살이 들어오는 걸 보며 '오늘 하루도 잘 보낼 수 있겠다'는 가벼운 확신이 들었습니다.

특별히 큰 일이 있지는 않았지만, 평온한 감정 속에서도 마음 한켠에 감사함이 자리잡고 있었어요. 해야 할 일들을 하나씩 차근차근 정리하면서, 오늘 하루가 무리 없이 흘러갔습니다.

저녁에는 잠깐 산책을 나갔어요. 바람이 시원하고 하늘이 맑아서 기분이 더 좋아졌습니다. 이런 평범한 하루가 사실 가장 소중한 하루라는 걸 다시 한번 느꼈어요.`;

const FOLDERS = ["블링크 소개", "독서", "기획", "디자인"];

function ShareDiaryPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("오늘의 하루");
  const [body, setBody] = useState(AI_DRAFT);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  function handlePublish() {
    navigate({ to: "/exchange-diary", search: { published: true } });
  }

  return (
    <div className="app-shell">
      <div className="app-frame flex flex-col bg-white">
        {/* 헤더 */}
        <header className="relative shrink-0 flex items-center justify-center px-4 pt-[52px] pb-3 border-b border-[#f5f5f5]">
          <Link
            to="/analysis"
            aria-label="뒤로"
            className="absolute left-3 top-[50px] grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <h1 className="font-semibold text-foreground text-[16px] tracking-tight">내용수정</h1>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => navigate({ to: "/analysis" })}
            className="absolute right-3 top-[50px] grid h-9 w-9 place-items-center rounded-full text-foreground/50 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto pb-[100px] px-5">
          {/* AI 배지 */}
          <div className="mt-4 mb-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-3 py-1.5">
            <span className="text-[12px] font-semibold text-[var(--primary)] tracking-tight">
              ✦ AI가 오늘의 일기를 작성했어요
            </span>
          </div>

          {/* 이미지 섹션 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground text-[15px] tracking-tight">이미지</span>
              <span className="text-[12px] text-[#999]">이미지는 최대 1장까지 불러올 수 있어요</span>
            </div>
            <div className="flex gap-2.5">
              {/* 더미 썸네일 */}
              <div className="h-[88px] w-[88px] shrink-0 rounded-xl bg-[var(--primary)] flex items-center justify-center overflow-hidden">
                <span className="text-white text-[10px] font-bold opacity-60 text-center leading-tight px-1">LINK</span>
              </div>
              {/* 추가 버튼 */}
              <button
                type="button"
                className="h-[88px] w-[88px] shrink-0 rounded-xl bg-[#f4f6fa] flex flex-col items-center justify-center gap-1 border border-dashed border-[#d0d5e0] active:scale-[0.97] transition"
              >
                <FolderOpen className="h-5 w-5 text-[#999]" />
                <Plus className="h-3 w-3 text-[#999] -mt-1" />
              </button>
            </div>
          </div>

          {/* 제목 */}
          <div className="mb-5">
            <p className="font-semibold text-foreground text-[15px] tracking-tight mb-2">제목</p>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl bg-[#f4f6fa] px-4 py-3.5 text-[15px] text-foreground tracking-tight outline-none focus:ring-2 focus:ring-[var(--primary)]/30 pr-10"
              />
              {title && (
                <button
                  type="button"
                  onClick={() => setTitle("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full bg-[#ccc] text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 요약 내용 */}
          <div className="mb-5">
            <p className="font-semibold text-foreground text-[15px] tracking-tight mb-2">요약 내용</p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={9}
              className="w-full rounded-2xl bg-[#f4f6fa] px-4 py-3.5 text-[14px] leading-[1.75] text-foreground tracking-tight outline-none focus:ring-2 focus:ring-[var(--primary)]/30 resize-none"
            />
          </div>

          {/* 폴더 */}
          <div>
            <p className="font-semibold text-foreground text-[15px] tracking-tight mb-2">폴더</p>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className="flex items-center gap-1 rounded-full bg-[#f4f6fa] px-3 py-1.5 text-[13px] text-foreground/60 border border-[#e8e8e8] active:scale-[0.97] transition"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              {FOLDERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFolder(f === selectedFolder ? null : f)}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] tracking-tight border active:scale-[0.97] transition ${
                    selectedFolder === f
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[#f4f6fa] text-foreground/70 border-[#e8e8e8]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-9 pt-3 bg-white border-t border-[#f0f0f0]">
          <button
            type="button"
            onClick={handlePublish}
            className="w-full flex items-center justify-center rounded-2xl bg-[var(--primary)] py-3.5 font-semibold text-white text-[15px] tracking-tight shadow-md active:scale-[0.99] transition"
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
