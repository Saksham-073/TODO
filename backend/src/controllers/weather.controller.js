const cache = new Map();
const TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;
  if (hit) cache.delete(key);
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, expires: Date.now() + TTL_MS });
}

function normalize(payload) {
  const { current, location } = payload;
  return {
    temp: Math.round(current.temp_f),
    tempC: Math.round(current.temp_c),
    condition: current.condition.text,
    icon: current.condition.icon, 
    humidity: current.humidity,
    resolvedName: location?.name,
  };
}

async function getWeather(req, res, next) {
  try {
    const location = (req.params.location || '').trim();
    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ message: 'Weather service is not configured' });
    }

    const cacheKey = location.toLowerCase();
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const base = process.env.WEATHER_API_BASE || 'http://api.weatherapi.com/v1';
    const url = `${base}/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`;

    const response = await fetch(url);
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const code = body?.error?.code;
      // 1006 = no matching location found
      if (code === 1006) {
        return res.status(404).json({ message: `Weather not found for "${location}"` });
      }
      // 1002 / 2006 = API key missing/invalid, 1003 = q missing, etc.
      return res.status(502).json({
        message: body?.error?.message || 'Weather provider error',
      });
    }

    const data = normalize(body);
    setCached(cacheKey, data);
    res.json(data);
  } catch (err) {
    // Network/parse failures
    err.status = err.status || 502;
    next(err);
  }
}

module.exports = { getWeather };
