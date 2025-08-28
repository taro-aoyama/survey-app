# アンケートアプリ

6項目のアンケートを取るためのRails + Reactアプリケーションです。

## 機能

- **アンケート入力画面**: 学籍番号と5つの質問項目（1-5段階評価）を入力
- **結果確認・ダウンロード画面**: アンケート結果の表示とCSVエクスポート機能
- **レスポンシブデザイン**: PC・スマートフォン両方に対応

## 技術スタック

### バックエンド
- **Rails 7.2.2.2** (APIモード)
- **Ruby 3.2.2**
- **PostgreSQL 15**
- **Docker**

### フロントエンド
- **React 18.2.0**
- **TypeScript 4.9.5**
- **Axios** (HTTP通信)
- **React Router** (ルーティング)
- **Docker**

## セットアップ

### 前提条件
- Docker Desktop
- Git

### インストール手順

1. リポジトリをクローン
```bash
git clone <repository-url>
cd survey-app
```

2. アプリケーションを起動
```bash
docker compose up --build
```

3. データベースのマイグレーションを実行（初回のみ）
```bash
docker compose exec backend rails db:migrate
```

### ポート設定の変更

デフォルトでは以下のポートが使用されます：
- **フロントエンド**: 3000
- **バックエンドAPI**: 3001
- **データベース**: 5432

ポートを変更したい場合は、環境変数を設定してください：

```bash
# バックエンドのポートを3002に変更
export BACKEND_PORT=3002

# フロントエンドのポートを3003に変更
export FRONTEND_PORT=3003

# アプリケーションを起動
docker compose up --build
```

または、起動時に直接指定：

```bash
BACKEND_PORT=3002 FRONTEND_PORT=3003 docker compose up --build
```

## 使用方法

### アクセス方法
- **フロントエンド（学生向け）**: http://localhost:3010
- **バックエンドAPI**: http://localhost:3011
- **管理者向け結果画面**: http://localhost:3010/admin/results

### ngrok経由でのアクセス
外部からアクセスする場合は、ngrokを使用できます：

1. **ngrokの設定**
   ```bash
   # フロントエンドのみを公開
   ngrok http 3010
   ```

2. **アクセスURL**
   - フロントエンド: `https://[ngrok-id].ngrok-free.app`
   - 管理者向け結果画面: `https://[ngrok-id].ngrok-free.app/admin/results`

3. **現在の制限**
   - ngrok経由でフロントエンドにアクセスする場合、APIリクエストはローカルのバックエンド（localhost:3011）に送信されます
   - 外部から完全にアクセスするには、バックエンドもngrokで公開する必要があります

4. **完全な外部アクセス（推奨）**
   ```bash
   # フロントエンド
   ngrok http 3010
   
   # 別のターミナルでバックエンド
   ngrok http 3011
   ```
   
   この場合、フロントエンドのコードを修正して、バックエンドのngrok URLを使用するように設定が必要です。

5. **注意事項**
   - CORS設定でngrokドメインからのアクセスを許可しています
   - ローカル開発環境での使用を推奨します

### アンケート項目
1. **問1**: 数値入力（整数）
2. **問2**: 数値入力（整数）
3. **問3**: 数値入力（整数）
4. **問4**: 数値入力（整数）
5. **問5**: 数値入力（整数）

### 入力制限
- 学籍番号: 最大20文字
- 問1〜問5: 整数値（範囲制限なし）

### セキュリティ
- 学生にはフォーム画面のみが表示されます
- 集計結果画面は `/admin/results` のURLを知っている人のみがアクセスできます
- ナビゲーションバーには結果画面へのリンクは表示されません

### API エンドポイント
- `GET /api/surveys` - アンケート一覧取得
- `POST /api/surveys` - アンケート作成
- `GET /api/exports/csv` - CSVエクスポート

## 開発

### コンテナの管理
```bash
# アプリケーション起動
docker compose up

# バックグラウンドで起動
docker compose up -d

# 特定のサービスのみ起動
docker compose up backend

# アプリケーション停止
docker compose down

# ログ確認
docker compose logs
docker compose logs backend
docker compose logs frontend
```

### データベース操作
```bash
# Railsコンソール起動
docker compose exec backend rails console

# マイグレーション実行
docker compose exec backend rails db:migrate

# データベースリセット
docker compose exec backend rails db:reset
```

## ファイル構成

```
survey-app/
├── backend/                 # Rails API
│   ├── app/
│   │   ├── controllers/    # APIコントローラー
│   │   ├── models/         # データモデル
│   │   └── ...
│   ├── config/             # 設定ファイル
│   ├── db/                 # データベース関連
│   └── Dockerfile
├── frontend/               # Reactアプリケーション
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   └── ...
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml      # Docker設定
└── README.md
```

## トラブルシューティング

### ポートが既に使用されている場合
```bash
# 使用中のポートを確認
lsof -i :3001
lsof -i :3000

# 既存のコンテナを停止
docker compose down
docker system prune -f
```

### データベースエラーが発生する場合
```bash
# マイグレーションを再実行
docker compose exec backend rails db:migrate

# データベースをリセット
docker compose exec backend rails db:reset
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
