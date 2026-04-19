import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";

interface TokenFormProps {
  onSubmit: (token: string) => void;
}

export function TokenForm({ onSubmit }: TokenFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("トークンを入力してください");
      return;
    }
    setError("");
    onSubmit(trimmed);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-10">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
        <KeyRound className="size-6 text-primary" />
      </div>

      <div className="space-y-1.5 text-center">
        <h2 className="text-base font-semibold tracking-tight">
          Qiita API トークンを登録
        </h2>
        <p className="text-xs leading-relaxed text-muted-foreground">
          トレンド記事の詳細を取得するために
          <br />
          <code className="rounded bg-muted px-1 py-0.5 text-[10px]">
            read_qiita
          </code>{" "}
          スコープのトークンが必要です
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <Input
          type="password"
          placeholder="アクセストークンを入力"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Qiita access token"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" className="w-full">
          登録する
        </Button>
      </form>

      <a
        href="https://qiita.com/settings/tokens/new"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        トークンの発行はこちら
      </a>
    </div>
  );
}
