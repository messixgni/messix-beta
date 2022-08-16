# Messixβ

Chatwork 向けに未返信管理を行える Chrome 拡張

[Chrome 拡張ストアはこちら](https://chrome.google.com/webstore/detail/messix-%CE%B2/bbefmfcmnjkpmpbbbagdoklendekcjdk?hl=ja&authuser=0)

## メンテナンスに関して

Messixβ は現在積極的な開発が行われていない状態です。
もし、修正や機能追加を行いたい場合は Fork などを検討ください。

## Setup

```
yarn install
```

### VisualStudioCode の設定

以下のプラグインを入れること

- Prettier

## Build

GoogleAnalytics を含まない最適化ビルドが生成される

```
yarn build
```

## Release Build

GoogleAnalytics を含むリリース用が生成される

```
yarn releasebuild
```

## Build in watch mode

GoogleAnalytics を含まない開発用ビルドが生成され、コードに変更があるたびにビルドされ直される

### terminal

```
yarn watch
```

### Visual Studio Code

type `Ctrl + Shift + B`

## Load extension to chrome

`yarn build`や`yarn watch`で生成される`dist`フォルダを Chrome に読み込ませる

## Test

現状テストは記載していないが、機能としては残す。

```
yarn jest
```

## Code format

Prettier によるコードフォーマットの実行

```
yarn style
```
