# iwill CDK Infrastructure

このディレクトリには、iwillプロジェクトのAWSインフラストラクチャをCDKで定義しています。
開発環境と本番環境を分離してデプロイできるように設計されています。

## 概要

主にメディア（写真・動画）のアップロードと配信のためのインフラを管理します：

- **S3バケット**: メディアファイルのストレージ
- **CloudFront**: メディア配信用CDN
- **IAMロール**: セキュアなアップロード権限管理

## 前提条件

- AWS CLI設定済み
- AWS CDK CLI インストール済み (`npm install -g aws-cdk`)
- 適切なAWS権限

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# CDKブートストラップ（初回のみ）
pnpm run bootstrap
```

## 環境別デプロイ

### 開発環境へのデプロイ

```bash
# コンテキスト変数を使用
pnpm run cdk deploy --context env=dev

# または環境変数を使用
CDK_ENV=dev pnpm run deploy
```

### 本番環境へのデプロイ

```bash
# コンテキスト変数を使用
pnpm run cdk deploy --context env=prod

# または環境変数を使用
CDK_ENV=prod pnpm run deploy
```

### デフォルト環境

環境が指定されない場合は、デフォルトで `dev` 環境が使用されます。

```bash
# dev環境にデプロイされる
pnpm run deploy
```

## 主要コマンド

- `pnpm run build` - TypeScriptのコンパイル
- `pnpm run watch` - ファイル変更の監視とコンパイル
- `pnpm run cdk synth` - CloudFormationテンプレートの生成
- `pnpm run cdk diff` - 変更内容の確認
- `pnpm run cdk deploy` - スタックのデプロイ
- `pnpm run cdk destroy` - スタックの削除

※ 全てのコマンドに `--context env=<environment>` オプションを追加できます

## 環境別の設定

### 開発環境 (dev)
- **リソース削除ポリシー**: DESTROY (スタック削除時にリソースも削除)
- **CORS設定**: localhostとVercelプレビュー環境を許可
- **スタック名**: `IwillMediaStack-dev`

### 本番環境 (prod)
- **リソース削除ポリシー**: RETAIN (スタック削除時もリソースを保持)
- **CORS設定**: 本番ドメインとVercelプレビュー環境のみ許可
- **スタック名**: `IwillMediaStack-prod`

## アーキテクチャ

### S3バケット
- プライベートバケット（CloudFront経由のみアクセス可能）
- バージョニング有効
- 暗号化有効
- ライフサイクルポリシー設定済み

### CloudFront
- Origin Access Control (OAC)使用
- HTTPS強制
- キャッシュ最適化
- CORS設定済み

### IAMロール
- 最小権限の原則
- ファイルサイズ制限（100MB）
- ファイルタイプ制限（画像・動画のみ）

## 出力値

デプロイ後、環境ごとに以下の値が出力されます：

- `MediaBucketName`: S3バケット名
- `MediaBucketArn`: S3バケットARN
- `CloudFrontDistributionUrl`: CloudFront URL
- `CloudFrontDistributionId`: CloudFront ID
- `MediaUploadRoleArn`: アップロード用IAMロールARN
- `Environment`: デプロイ環境 (dev/prod)

### エクスポート名

出力値は環境ごとに異なるエクスポート名で保存されます：
- `iwill-media-bucket-name-{environment}`
- `iwill-media-bucket-arn-{environment}`
- `iwill-cloudfront-url-{environment}`
- `iwill-cloudfront-id-{environment}`
- `iwill-media-upload-role-arn-{environment}`

これらの値をアプリケーションの環境変数に設定してください。

## トラブルシューティング

### デプロイエラー
- AWS認証情報を確認: `aws sts get-caller-identity`
- CDKブートストラップを実行: `pnpm run bootstrap`

### アクセス拒否
- CloudFrontのOACが正しく設定されているか確認
- S3バケットポリシーを確認