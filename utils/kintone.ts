// kintone API ユーティリティ（Background Script経由）

export interface KintoneTask {
    $id: { value: string };
    title: { value: string };
    status: { value: string };
    assignee: { value: string };
    dueDate: { value: string };
}

// Background Scriptにメッセージを送ってデータを取得
export async function fetchKintoneTasks(query?: string): Promise<KintoneTask[]> {
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage(
            {
                type: 'FETCH_KINTONE_TASKS',
                query: query
            },
            (response) => {
                if (response.success) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.error));
                }
            }
        );
    });
}