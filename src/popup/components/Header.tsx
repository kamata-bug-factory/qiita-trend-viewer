import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  cachedAt: number | null;
}

function formatUpdatedAt(cachedAt: number): string {
  const diffMs = Date.now() - cachedAt;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;

  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}時間前`;
}

export function Header({ onRefresh, onLogout, cachedAt }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <img src="/icons/icon48.png" alt="" className="size-5" />
        <div>
          <h1 className="text-sm font-bold leading-none tracking-tight">
            Qiita Trend
          </h1>
          {cachedAt && (
            <p className="mt-0.5 text-[10px] leading-none text-muted-foreground">
              {formatUpdatedAt(cachedAt)}に更新
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRefresh}
          aria-label="Refresh"
        >
          <RefreshCw className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onLogout}
          aria-label="Logout"
        >
          <LogOut className="size-3.5" />
        </Button>
      </div>
    </header>
  );
}
