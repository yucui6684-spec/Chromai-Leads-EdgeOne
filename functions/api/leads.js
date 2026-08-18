// 科诺美线索系统 API - leads（线索池 CRUD，Blob 存储）
import { getStore } from "@edgeone/pages-blob";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const store = getStore('chromai-leads');

  if (request.method === 'GET') {
    try {
      const data = await store.get('leads', { type: 'json', consistency: 'strong' });
      if (data) {
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
        });
      }
      return new Response(JSON.stringify({ data: [], headers: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
      });
    } catch (e) {
      return new Response(JSON.stringify({ data: [], headers: [], error: e.message }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
      });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      await store.set('leads', JSON.stringify(body));
      return new Response(JSON.stringify({ ok: true, count: body.data ? body.data.length : 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
  });
}
