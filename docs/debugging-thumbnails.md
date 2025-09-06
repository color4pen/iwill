# サムネイル生成のデバッグガイド

## 問題の概要
サムネイルが生成されない問題のトラブルシューティング手順

## 確認手順

### 1. AWS Lambda関数の確認
1. AWSコンソールにログイン
2. Lambda → 関数 → `iwill-thumbnail-generator-{環境名}` を選択
3. 「モニタリング」タブで以下を確認：
   - 関数が呼び出されているか（Invocations）
   - エラーが発生していないか（Errors）
   - CloudWatch Logsでエラーログを確認

### 2. S3イベント通知の確認
1. S3コンソール → `iwill-wedding-media-{環境名}` バケット
2. 「プロパティ」タブ → 「イベント通知」セクション
3. Lambda関数へのイベント通知が設定されているか確認

### 3. Lambda関数のアクセス権限
1. Lambda関数のIAMロールを確認
2. S3バケットへの読み書き権限があるか確認
3. CloudWatch Logsへの書き込み権限があるか確認

### 4. Lambda Layerの確認
1. Lambda関数の設定でLayerが正しくアタッチされているか確認：
   - SharpLayer
   - FFmpegLayer

### 5. 手動テスト
```bash
# S3に直接画像をアップロードしてテスト
aws s3 cp test-image.jpg s3://iwill-wedding-media-{環境名}/test/test-image.jpg

# CloudWatch Logsを確認
aws logs tail /aws/lambda/iwill-thumbnail-generator-{環境名} --follow
```

## よくある問題と解決策

### 1. Lambda関数がトリガーされない
- **原因**: S3イベント通知が正しく設定されていない
- **解決策**: CDKを再デプロイ
```bash
cd apps/cdk
npm run cdk:deploy
```

### 2. Sharpエラー
- **原因**: Layerが正しくビルドされていない
- **解決策**: Layerを再ビルド
```bash
cd apps/cdk/lambda-layers
./build-layers.sh
cd ..
npm run cdk:deploy
```

### 3. FFmpegエラー（動画の場合）
- **原因**: FFmpegバイナリの実行権限がない
- **解決策**: build-layers.shで`chmod +x`が実行されているか確認

### 4. タイムアウトエラー
- **原因**: 大きなファイルの処理に時間がかかる
- **解決策**: Lambda関数のタイムアウトを増やす（現在5分）

### 5. メモリ不足エラー
- **原因**: 大きな画像/動画の処理にメモリが不足
- **解決策**: Lambda関数のメモリサイズを増やす（現在3008MB）

## Lambda関数のデバッグ用ログ追加

Lambda関数（`index.js`）の最初に以下を追加してデバッグ：

```javascript
exports.handler = async (event) => {
  console.log('=== THUMBNAIL GENERATOR START ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Environment:', {
    THUMBNAIL_WIDTH: process.env.THUMBNAIL_WIDTH,
    THUMBNAIL_HEIGHT: process.env.THUMBNAIL_HEIGHT,
    THUMBNAIL_QUALITY: process.env.THUMBNAIL_QUALITY,
    AWS_REGION: process.env.AWS_REGION,
  });
  
  // 既存のコード...
```

## 環境変数の確認
Lambda関数に以下の環境変数が設定されているか確認：
- `THUMBNAIL_WIDTH`: 400
- `THUMBNAIL_HEIGHT`: 400
- `THUMBNAIL_QUALITY`: 80
- `S3_BUCKET`: バケット名

## 既存メディアのサムネイル生成
既存のメディアファイルに対してサムネイルを生成するには、`scripts/generate-thumbnails.ts`を使用：

```bash
cd scripts
npm install
npm run generate-thumbnails
```