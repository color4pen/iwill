// Type declarations
/// <reference path="./types/next-auth.d.ts" />

// Base exports
export { baseAuthOptions, getCookiePrefix, getCookieConfig } from './base'

// App-specific exports
export { webAuthOptions } from './web'
export { adminAuthOptions } from './admin'