import { z } from 'zod'

/**
 * 共通の環境変数スキーマ
 */
export const baseEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  
  // LINE OAuth
  LINE_CLIENT_ID: z.string().min(1, 'LINE_CLIENT_ID is required'),
  LINE_CLIENT_SECRET: z.string().min(1, 'LINE_CLIENT_SECRET is required'),
  
  // Node
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

/**
 * 環境変数を検証する汎用関数
 */
export function validateEnv<T extends z.ZodTypeAny>(
  schema: T,
  env: NodeJS.ProcessEnv = process.env
): z.infer<T> {
  try {
    return schema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      console.error(error.flatten().fieldErrors)
      throw new Error('Invalid environment variables')
    }
    throw error
  }
}