#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IwillMediaStack } from '../lib/cdk-stack';

const app = new cdk.App();

// 環境を取得（コンテキスト変数 > 環境変数 > デフォルト）
const environment = app.node.tryGetContext('env') || process.env.CDK_ENV || 'dev';

// 環境設定
const envConfig = {
  dev: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
    description: 'Media storage infrastructure for iwill wedding management app (Development)',
    removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境では削除可能
    corsOrigins: [
      'https://*.vercel.app',
      'https://dev.iwill.yurinasu.com',
      'https://iwill.yurinasu.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
  },
  prod: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
    description: 'Media storage infrastructure for iwill wedding management app (Production)',
    removalPolicy: cdk.RemovalPolicy.RETAIN, // 本番環境では保護
    corsOrigins: [
      'https://iwill-wedding.vercel.app', // TODO: 本番ドメインに更新
      'https://*.vercel.app',
    ],
  },
};

const config = envConfig[environment as keyof typeof envConfig];

if (!config) {
  throw new Error(`Invalid environment: ${environment}. Use 'dev' or 'prod'.`);
}

new IwillMediaStack(app, `IwillMediaStack-${environment}`, {
  env: {
    account: config.account,
    region: config.region,
  },
  description: config.description,
  environment,
  removalPolicy: config.removalPolicy,
  corsOrigins: config.corsOrigins,
  // Vercel OIDC設定
  vercelTeamSlug: 'colorfull',
  vercelProjectName: 'iwill-web',
});