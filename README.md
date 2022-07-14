# Messix-MVP1-Chrome-Addon

Chatwork 向けに未返信管理を行える Messix のプロトタイプ。  
サーバーを用いないでブラウザーの IndexDB を用いている。

## Setup

```
yarn install
```

### VisualStudioCode の設定

以下のプラグインを入れること

- Prettier

...

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

## MoriEditon Build

森さん向け GoogleAnalytics を含むリリース用が生成される

```
yarn moribuild
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
