export const isDevelopmentEnv = () => {
  return process.env.NODE_ENV === 'development';
};

export const shouldEnableRestrictedFeatures = () => {
  return isDevelopmentEnv() && process.env.NEXT_PUBLIC_ENABLE_ALL_FEATURES === 'true';
};