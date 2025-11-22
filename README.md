# Computer Builder

CPU / GPU / RAM / Storage を選んでベンチマークを比較できる PC 組み立てシミュレーター

## 概要

ブラウザ上で好みのパーツを選び、Gaming / Work 用途それぞれのスコアを即座に可視化します。Bootstrap を動的に読み込み、シングルページで完結する軽量ツールです。

## 機能

- Recursion API から CPU / GPU / RAM / Storage の最新データを取得
- ブランド → モデルの依存セレクトボックスと、RAM 本数 / Storage 容量によるフィルタリング
- パーツ構成を追加すると Gaming / Work スコアと進捗バーを表示
- Bootstrap ベースのレスポンシブカードレイアウトとカスタムテーマ

## 使い方

1. `index.html` をブラウザで開きます。
2. 各ステップのセレクトから CPU / GPU / RAM / Storage を順番に選択します。
3. すべての項目を入力したら **Add PC** ボタンを押し、構成をリストに追加します。
4. カード下部で Gaming / Work スコアの比較や構成の再確認ができます。

## ファイル構成

- `index.html` - エントリーポイント。`app.js` を読み込み、アプリを起動します。
- `app.js` - AppInitializer / Model / View / Controller をまとめたメインロジック。
- `styles.css` - Jumbotron やカード、プログレスバーのカスタムスタイル。

## カスタマイズ手順

1. 取得先 API を変更したい場合は `app.js` の `config.url` を書き換えてください。
2. スコア配分を調整したい場合は `PC.getGamingBenchmark` / `PC.getWorkBenchmark` の重みを編集します。
3. UI ステップや入力項目を追加したい場合は `View.createInitialPage` 内のフォーム要素を編集します。
4. テーマカラーや余白は `styles.css` で上書きできます。

## 参考にしたURL
[https://getbootstrap.com/](https://getbootstrap.com/)

[https://developer.mozilla.org/ja/](https://developer.mozilla.org/ja/)

[https://api.recursionist.io/](https://api.recursionist.io/)

## スニペットURL
[https://recursionist.io/users/Kemui?public-lc](https://recursionist.io/users/Kemui?public-lc)

## Github URL
[https://github.com/Kemu-ramu/computerBuilder](https://github.com/Kemu-ramu/computerBuilder)

## 公開サイトURL
 [https://kemu-ramu.github.io/computerBuilder/](https://kemu-ramu.github.io/computerBuilder/)

