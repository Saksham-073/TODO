// Single source of truth for the API base URL.
// Override at build time with the API_URL env var (e.g. for deploys).
export const API_URL = process.env.API_URL || 'http://localhost:5001/api';
