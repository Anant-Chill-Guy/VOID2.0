






const rawBackend = process.env.BACKEND_URL || '';
const BACKEND = rawBackend
  ? rawBackend.replace(/\/+$/, '').replace(/^(?!https?:\/\/)/i, 'https://')
  : '';

export const handler = async (event) => {
  if (!BACKEND) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'BACKEND_URL is not configured on the server' }),
    };
  }

  
  let path = event.path || '/';
  path = path.replace(/^\/api/, '').replace(/^\/\.netlify\/functions\/api/, '');
  const query = event.rawQuery ? `?${event.rawQuery}` : '';
  const url = `${BACKEND}/api${path}${query}`;

  const method = event.httpMethod;
  const headers = {
    'content-type': event.headers['content-type'] || 'application/json',
  };

  let body;
  if (event.body && method !== 'GET' && method !== 'HEAD') {
    body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
    headers['content-length'] = Buffer.byteLength(body);
  }

  const res = await fetch(url, { method, headers, body });
  const text = await res.text();

  return {
    statusCode: res.status,
    headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
    body: text,
  };
};
