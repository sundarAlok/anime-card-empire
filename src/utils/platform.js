export const getPlatformId = () => {
  // Prefer explicit environment var (set per deployment), otherwise use hostname
  const envId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_INSTANCE) || (typeof process !== 'undefined' && process.env && process.env.VITE_APP_INSTANCE);
  if (envId) return String(envId);

  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return window.location.hostname.replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  return 'unknown_platform';
};

export const getScopedUid = (authUid) => {
  const platform = getPlatformId();
  return `${platform}:${authUid}`;
};
