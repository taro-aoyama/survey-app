FROM ruby:3.2.2

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# Gemfileをコピー
COPY Gemfile ./

# gemをインストール（Gemfile.lockがなくても動作）
RUN bundle install

# アプリケーションのコードをコピー
COPY . .

# ポート3001を公開
EXPOSE 3001
