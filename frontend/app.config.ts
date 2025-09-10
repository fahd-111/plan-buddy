export default ({ config }: any) => {
  const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.5:8787';

  return {
    ...config,
    extra: {
      ...(config?.extra || {}),
      API_BASE_URL: API_BASE,
    },
  };
};