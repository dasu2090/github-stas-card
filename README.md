# GitHub 統計カードジェネレーター

GitHub APIを使用してGitHub統計カードをSVG形式で生成するWebアプリケーションです。

![License](https://img.shields.io/badge/license-MIT-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🌟 特徴

- GitHub APIからリアルタイムでデータを取得
- SVGカードを自動生成
- ダウンロード機能付き
- レスポンシブデザイン
- 認証不要

## 📊 表示される統計情報

- ユーザー名
- 総スター数（全リポジトリの合計）
- 総リポジトリ数
- フォロワー数

## 🚀 使用方法

1. リポジトリをクローン:
```bash
git clone git@github.com:dasu2090/github-stas-card.git
```

2. `index.html`をブラウザで開く、またはローカルサーバーで起動。
```bash
python -m http.server 8000
```

3. GitHubユーザー名を入力してカードを生成

## 🏗️ プロジェクト構造

```
├── index.html    # メインHTML構造
├── styles.css    # スタイリング
└── app.js       # アプリケーションロジック
```

## 🛠️ 技術スタック

- **HTML5/CSS3**
- **JavaScript+**
- **GitHub API**
- **SVG**

## 🔧 API使用について

GitHub APIのレート制限（認証なし：60リクエスト/時間）に対応したエラーハンドリングを実装しています。

## 🎨 カスタマイズ

### スタイル変更
`styles.css`でカラーテーマ、レイアウト、アニメーションを変更可能

### カードデザイン
`app.js`の`createStatsCard()`関数でSVGレイアウトを調整可能

## 🚨 エラーハンドリング

- ユーザーが見つからない場合
- APIレート制限到達時
- ネットワークエラー
- 入力値検証とXSS防止

## 🤝 コントリビューション

1. フォークしてブランチ作成
2. 変更を実装
3. プルリクエストを送信
