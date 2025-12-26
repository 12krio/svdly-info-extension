import React, { useState, useEffect } from 'react';
import { fetchKintoneTasks, type KintoneTask } from '../../utils/kintone';

export function KintonePanel() {
    const [tasks, setTasks] = useState<KintoneTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchKintoneTasks();
            setTasks(data);
        } catch (err) {
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    // kintoneレコードのURLを生成
    const getRecordUrl = (recordId: string) => {
        const subdomain = import.meta.env.VITE_KINTONE_SUBDOMAIN;
        const appId = import.meta.env.VITE_KINTONE_APP_ID;
        return `https://${subdomain}.cybozu.com/k/${appId}/show#record=${recordId}`;
    };

    return (
        <div className="kintone-container">
            <div className="kintone-header">
                <h2>タスク一覧（kintone）</h2>
                <button
                    className="kintone-refresh-button"
                    onClick={loadTasks}
                    disabled={loading}
                >
                    {loading ? '読み込み中...' : '更新'}
                </button>
            </div>

            <div className="kintone-body">
                {loading && <div className="loading">読み込み中...</div>}

                {error && <div className="error">{error}</div>}

                {!loading && !error && tasks.length === 0 && (
                    <div className="empty">タスクがありません</div>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <div className="table-wrapper">
                        <table className="task-table">
                            <thead>
                            <tr>
                                <th>タイトル</th>
                                <th>ステータス</th>
                                <th>担当者</th>
                                <th>期限</th>
                                <th>詳細</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tasks.map((task) => (
                                <tr key={task.$id.value}>
                                    <td className="task-title-cell">
                                        <a
                                            href={getRecordUrl(task.$id.value)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="task-title-link"
                                        >
                                            {task.title.value}
                                        </a>
                                    </td>
                                    <td>
                                        <span className="task-status">{task.status.value}</span>
                                    </td>
                                    <td>{task.assignee.value}</td>
                                    <td>{task.dueDate.value || '-'}</td>
                                    <td className="task-action-cell">
                                        <a
                                            href={getRecordUrl(task.$id.value)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="task-link"
                                        >
                                            開く
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}