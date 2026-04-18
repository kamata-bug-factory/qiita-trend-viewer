# qiita-trend-viewer

## プロジェクト概要

Qiitaのトレンド記事をブラウザのツールバーから確認できるChrome拡張機能。
詳細な仕様は `docs/SPEC.md` を参照。

## 技術スタック

- **言語:** TypeScript（strict mode）
- **UI:** React 19 + Vite
- **UIライブラリ:** shadcn/ui + Tailwind CSS v4
- **Chrome拡張:** Manifest V3
- **ビルド:** Vite（CRXJS Vite Plugin で Chrome拡張向けにビルド）

## プロジェクト構成

```
src/
├── popup/           # ポップアップUI（エントリポイント）
│   ├── main.tsx
│   ├── App.tsx
│   └── components/  # ポップアップ固有のコンポーネント
├── components/      # 共有UIコンポーネント（shadcn/ui）
├── lib/             # ユーティリティ
├── hooks/           # カスタムフック
├── services/        # 外部通信・データ取得ロジック
│   ├── feed.ts      # Qiitaフィードのパース
│   └── api.ts       # Qiita API クライアント
├── storage/         # chrome.storage のラッパー
└── types/           # 型定義
public/
├── manifest.json    # Chrome拡張マニフェスト（Manifest V3）
└── icons/           # 拡張機能アイコン
```

## 開発コマンド

```bash
npm install          # 依存インストール
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run lint         # ESLint 実行
npm run typecheck    # 型チェック
```

## 開発ワークフロー

1. `npm run build` でビルド
2. Chrome で `chrome://extensions` を開く
3. 「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」から `dist/` を選択

## コーディング規約

- 関数コンポーネントと hooks を使用（クラスコンポーネント不可）
- 状態管理は React hooks で完結させる（外部状態管理ライブラリ不要）
- `chrome.storage` へのアクセスは `src/storage/` のラッパー経由で行う
- API通信は `src/services/` に集約する
- 型定義は `src/types/` に集約する
- コード・コメントは英語、ドキュメントは日本語で記述する

## アーキテクチャ上の判断

- **表示件数10件制限:** フィードから30件取得可能だが、Qiita API への N+1 リクエストを抑制するため上位10件のみ使用
- **キャッシュ:** `chrome.storage.local` に記事情報を保存、有効期限3時間
- **トークン保存:** `chrome.storage.local` に保存。ディスク上に平文で保存されるリスクはあるが、read_qiita スコープ（読み取り専用）のトークンであり、OS側のセキュリティ対策でカバーする方針
