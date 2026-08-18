// 科诺美线索系统 API - status（状态检查，轻量级不读数据）
import { getStore } from "@edgeone/pages-blob";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
  const result = {
    status: 'running',
    platform: 'edgeone',
    storage: 'blob',
    timestamp: new Date().toISOString()
  };
  try {
    const store = getStore('chromai-leads');
    // 只检查 leads 是否存在，不读取全部数据（避免超时）
    const leads = await store.get('leads', { type: 'json', consistency: 'strong' });
    result.blobReady = true;
    result.leadsCount = leads && leads.data ? leads.data.length : 0;
  } catch (e) {
    result.blobReady = false;
    result.error = e.message;
  }
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
  });
}
