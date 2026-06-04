import client from './client';

// GET /api/weather/:location -> { temp, tempC, condition, icon, humidity, ... }
export const fetchWeather = async (location) => {
  const { data } = await client.get(`/weather/${encodeURIComponent(location)}`);
  return data;
};
