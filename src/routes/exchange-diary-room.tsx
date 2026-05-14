import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, MoreVertical, MessageCircle, Send, Link2 } from "lucide-react";

export const Route = createFileRoute("/exchange-diary-room")({
  head: () => ({
    meta: [
      { title: "교환 일기장 — 안다미로" },
      { name: "theme-color", content: "#ffffff" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { roomId?: number } => {
    const n = Number(search.roomId);
    return Number.isFinite(n) && n > 0 ? { roomId: n } : {};
  },
  component: ExchangeDiaryRoomPage,
});

type Reply = { id: number; author: string; initial: string; time: string; body: string };
type Comment = { id: number; author: string; initial: string; time: string; body: string; replies: Reply[] };
type Post = {
  id: number;
  author: string;
  initial: string;
  date: string;
  title: string;
  preview: string;
  commentCount: number;
  comments: Comment[];
};

const ROOM_DATA: Record<number, { name: string; posts: Post[] }> = {
  1: {
    name: "봄날의 우리들",
    posts: [
      {
        id: 1,
        author: "박고운",
        initial: "박",
        date: "방금",
        title: "오늘 하루도 평온하게",
        preview: "오늘은 특별한 일이 없었지만 마음이 차분하게 가라앉은 하루였어요. 아침에 커피 한 잔을 마시며 창밖을 바라보는 시간이 참 좋았습니다.",
        commentCount: 2,
        comments: [
          {
            id: 1,
            author: "박고운",
            initial: "박",
            time: "방금",
            body: "댓글",
            replies: [
              { id: 1, author: "박고운", initial: "박", time: "방금", body: "답글" },
            ],
          },
        ],
      },
      {
        id: 2,
        author: "이수현",
        initial: "이",
        date: "어제",
        title: "드디어 프로젝트 마무리!",
        preview: "드디어 프로젝트가 끝났다. 3개월 동안 정말 힘들었는데, 결과물을 보니 뿌듯하다. 팀원들한테 고맙다는 말을 꼭 해야겠어.",
        commentCount: 1,
        comments: [
          {
            id: 2,
            author: "박고운",
            initial: "박",
            time: "어제",
            body: "수고했어! 정말 대단하다 🎉",
            replies: [],
          },
        ],
      },
      {
        id: 3,
        author: "김지원",
        initial: "김",
        date: "2일 전",
        title: "봄비가 내리던 날",
        preview: "오늘 봄비가 내렸어요. 우산을 챙겨 나갔는데 빗소리가 생각보다 좋아서 카페에서 한참을 멍하니 앉아 있었습니다.",
        commentCount: 0,
        comments: [],
      },
    ],
  },
  2: {
    name: "일상 기록단",
    posts: [
      {
        id: 1,
        author: "최민준",
        initial: "최",
        date: "2시간 전",
        title: "집중했던 하루",
        preview: "오늘은 딥워크를 제대로 해봤다. 핸드폰을 멀리 두고 3시간 동안 코딩만 했는데 정말 뿌듯했어.",
        commentCount: 0,
        comments: [],
      },
    ],
  },
};

function ExchangeDiaryRoomPage() {
  const { roomId } = Route.useSearch();
  const room = ROOM_DATA[roomId ?? 1] ?? ROOM_DATA[1];
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  function handleCopyLink() {
    setLinkCopied(true);
    setShowMenu(false);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  return (
    <div className="app-shell">
      <div className="app-frame flex flex-col" style={{ background: "#f5f6f8" }}>
        {/* 헤더 */}
        <header className="relative shrink-0 flex items-center justify-between px-4 pt-[52px] pb-3 bg-white border-b border-[#f5f5f5]">
          <Link
            to="/exchange-diary"
            aria-label="뒤로"
            className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <h1 className="font-semibold text-foreground text-[16px] tracking-tight truncate max-w-[180px]">
            {room.name}
          </h1>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full text-foreground/60 hover:text-foreground active:scale-[0.97] transition"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 z-30 rounded-2xl bg-white shadow-lg border border-[#f0f0f0] overflow-hidden min-w-[160px]">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-[14px] text-foreground tracking-tight hover:bg-[#fafbfc] active:bg-[#f4f6fa]"
                >
                  <Link2 className="h-4 w-4 text-[var(--primary)]" />
                  초대 링크 복사
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 게시글 목록 */}
        <div className="flex-1 overflow-y-auto pb-[80px]">
          <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
            {room.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                expanded={expandedPost === post.id}
                onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              />
            ))}
          </div>
        </div>

        {/* 댓글 입력창 */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] px-4 py-3 flex items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--primary)]/15 text-[var(--primary)] font-semibold text-[13px]">
            박
          </div>
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 rounded-full bg-[#f4f6fa] px-4 py-2 text-[13px] text-foreground tracking-tight outline-none"
          />
          <button
            type="button"
            disabled={!commentInput.trim()}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-white disabled:opacity-40 active:scale-[0.96] transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* 링크 복사 토스트 */}
        <div
          className={`absolute bottom-[72px] left-1/2 -translate-x-1/2 z-30 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white shadow-lg transition-all duration-300 whitespace-nowrap ${
            linkCopied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          초대 링크가 복사되었어요 ✓
        </div>
      </div>
    </div>
  );
}

function PostCard({
  post,
  expanded,
  onToggle,
}: {
  post: Post;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [openReply, setOpenReply] = useState<number | null>(null);

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* 게시글 상단 */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--primary)]/15 text-[var(--primary)] font-semibold text-[13px]">
            {post.initial}
          </div>
          <div>
            <span className="text-[13px] font-semibold text-foreground tracking-tight">{post.author}</span>
            <span className="ml-1.5 text-[11px] text-[#bbb]">{post.date}</span>
          </div>
        </div>

        <h3 className="font-semibold text-foreground text-[15px] tracking-tight mb-1.5">{post.title}</h3>
        <p className="text-[13px] leading-[1.65] text-foreground/70 tracking-tight line-clamp-3">{post.preview}</p>

        {/* 댓글 토글 버튼 */}
        <button
          type="button"
          onClick={onToggle}
          className="mt-3 flex items-center gap-1.5 text-[12px] text-[#999] active:text-foreground/60 transition"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          댓글 {post.commentCount > 0 ? post.commentCount : ""}
          {expanded ? " 접기" : " 보기"}
        </button>
      </div>

      {/* 댓글 섹션 */}
      {expanded && (
        <div className="border-t border-[#f5f5f5] bg-[#fafbfc] px-4 py-4">
          {post.comments.length === 0 ? (
            <p className="text-[12px] text-[#bbb] text-center py-2">아직 댓글이 없어요</p>
          ) : (
            <div className="flex flex-col gap-4">
              {post.comments.map((comment) => (
                <div key={comment.id}>
                  <div className="flex items-start gap-2.5">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--primary)]/15 text-[var(--primary)] font-semibold text-[12px]">
                      {comment.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[13px] font-semibold text-foreground tracking-tight">{comment.author}</span>
                        <span className="text-[11px] text-[#bbb]">{comment.time}</span>
                      </div>
                      <p className="mt-0.5 text-[13px] text-foreground/80 tracking-tight">{comment.body}</p>
                      <button
                        type="button"
                        onClick={() => setOpenReply(openReply === comment.id ? null : comment.id)}
                        className="mt-1 text-[12px] text-[var(--primary)] active:opacity-70"
                      >
                        {openReply === comment.id ? "답글 닫기" : "답글 달기"}
                      </button>
                    </div>
                  </div>

                  {/* 답글 목록 */}
                  {openReply === comment.id && comment.replies.length > 0 && (
                    <div className="ml-9 mt-2 flex flex-col gap-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e8edf5] text-[var(--primary)] font-semibold text-[11px]">
                            {reply.initial}
                          </div>
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[12px] font-semibold text-foreground tracking-tight">{reply.author}</span>
                              <span className="text-[11px] text-[#bbb]">{reply.time}</span>
                            </div>
                            <p className="mt-0.5 text-[12.5px] text-foreground/75 tracking-tight">{reply.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
