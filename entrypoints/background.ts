export default defineBackground(() => {
  // Content ScriptからのメッセージをリスナーとTUNE
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log('Received message:', message);
    console.log('message.type:', message.type);
    if (message.type === 'FETCH_KINTONE_TASKS') {
      console.log('message.query:', message.query);

      fetchKintoneTasks(message.query)
          .then(tasks => sendResponse({ success: true, data: tasks }))
          .catch(error => sendResponse({ success: false, error: error.message }));

      // 非同期レスポンスを返すため true を返す
      return true;
    }
  });
});

// kintone API呼び出し
async function fetchKintoneTasks(query?: string) {
  const KINTONE_SUBDOMAIN = import.meta.env.VITE_KINTONE_SUBDOMAIN;
  const KINTONE_APP_ID = import.meta.env.VITE_KINTONE_APP_ID;
  const KINTONE_API_TOKEN = import.meta.env.VITE_KINTONE_API_TOKEN;

  const url = `https://${KINTONE_SUBDOMAIN}.cybozu.com/k/v1/records.json`;

  const params = new URLSearchParams({
    app: KINTONE_APP_ID,
  });

  if (query) {
    params.append('query', query);
  }
  console.log('`${url}?${params}`:', `${url}?${params}`);
  console.log( 'X-Cybozu-API-Token', KINTONE_API_TOKEN);

  const response = await fetch(`${url}?${params}`, {
    method: 'GET',
    headers: {
      'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      //'Content-Type': 'application/json',
    },
  });
  console.log('rquest');

  if (!response.ok) {
    console.log('error');
    console.log(`kintone API error: ${response.statusText}`);

    throw new Error(`kintone API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('rquest',data.records);

  return data.records;
}