import { useState, useCallback } from 'react';

// Use VITE_BACKEND_URL from .env (or .env.local) for deployed environments.
// Falls back to localhost:8000 so local dev works without any .env file.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';


/**
 * Custom hook for Varithon backend queries.
 *
 * Returns:
 *   loading    — boolean, true while the fetch is in-flight
 *   result     — { category, source, message } | null
 *   submitQuery(text) — fires POST /query and updates result
 *   clearResult()     — resets result back to null
 */
export function useVarithonQuery() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submitQuery = useCallback(async (text) => {
    if (!text || !text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${BACKEND_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Backend returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        category: 'error',
        source: 'network',
        message: `बॅकएंड सर्व्हरशी संपर्क होऊ शकला नाही. कृपया नंतर पुन्हा प्रयत्न करा. (${err.message})`,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return { loading, result, submitQuery, clearResult };
}
