import { useState, useEffect } from "react";
import styles from "./UsersPage.module.css";

function UsersPage() {
  const [contacts, setContacts] = useState([]); //空の配列で初期化
  const [loading, setLoading] = useState(true); //ローディング中かどうか
  const [error, setError] = useState(null); //エラーがあれば内容表示

  useEffect(() => {
    fetch("http://localhost:8080/api/contacts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("データの取得に失敗しました");
        }
        return res.json();
      })
      .then((data) => {
        setContacts(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.loading}>読み込み中...</p>;
  if (error) return <p className={styles.error}>エラー： {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>お問合せ一覧({contacts.length}件)</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>メール</th>
            <th>カテゴリ</th>
            <th>担当者</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            //データが0件の場合
            <tr>
              <td colSpan={5} className={styles.empty}>
                データがありません
              </td>
            </tr>
          ) : (
            //データがある場合map()で並べる
            contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>
                  <span className={styles.badge}>{contact.category?.name ?? "未分類"}</span>
                </td>
                <td>{contact.assigned_user?.name ?? "未対応"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;
