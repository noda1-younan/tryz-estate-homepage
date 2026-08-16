# トライズエステート株式会社 公式ホームページ

令和8年10月1日設立予定のトライズエステート株式会社の公式ホームページです。
地域に根ざした不動産会社としての誠実さと、公式ブランドロゴ（TRYS ESTATE）を使用した1ページ構成のサイトです。

## 使用技術

- HTML / CSS / JavaScript（静的サイト、ビルドツールなし）
- Googleフォント（Noto Serif JP / Noto Sans JP）を外部読み込み
- ホスティング：Cloudflare Pages（GitHub連携による自動デプロイ）

## 公開環境

- 本番URL（Cloudflare Pagesの仮URL）：`https://tryz-estate.pages.dev`
- GitHubの`main`ブランチにpushすると、Cloudflare Pagesが自動でビルド・公開します。

## ファイル構成

```text
.
├── index.html          # トップページ（1ページに全セクションを内包）
├── 404.html
├── robots.txt
├── sitemap.xml
├── _headers            # Cloudflare Pages用セキュリティヘッダー設定
├── favicon.ico
├── assets/
│   ├── images/          # ロゴ、ヒーロー画像（webp）、favicon、OGP画像
│   └── js/
│       └── main.js      # メニュー開閉・お問い合わせフォームの仮動作
└── README.md
```

## ローカルでの確認方法

```bash
python3 -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開いてください。

## 更新方法（プログラミング初心者向け）

1. `index.html` 内の日本語テキスト部分だけを書き換えます（`<...>` のタグ部分は変更しないでください）。
2. 画像を差し替える場合は `assets/images/` に新しい画像を置き、`src="assets/images/ファイル名"` を書き換えます。
3. 変更を保存したら、GitHubへ commit → push してください。
4. pushすると数十秒〜数分でCloudflare Pagesが自動的に本番サイトへ反映します。
5. 反映後は必ず本番URLを開いて、表示が崩れていないか確認してください。

## お問い合わせフォームについて

現在、フォームの送信は仮実装です（送信ボタンを押すと「送信機能は仮実装です」という案内のみ表示されます）。
会社のメールアドレスが確定した後、フォーム送信サービスと接続する対応が必要です。

## 掲載情報についての注意

このサイトは、会社として事実確認できている情報のみを掲載する方針です。
所在地・電話番号・メールアドレス・宅地建物取引業免許番号・実績件数・お客様の声などは、確定するまで掲載しないでください。
