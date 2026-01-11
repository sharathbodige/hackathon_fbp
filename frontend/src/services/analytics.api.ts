const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAnalytics = async () => {
  const response = await fetch(`${BASE_URL}analytics`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
};
