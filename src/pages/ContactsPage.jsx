import { useState, useEffect } from "react";
import styles from "./ContactsPage.module.css";

// 都道府県→市区町村データ（Laravel側と合わせる）
const cityData = {
  東京都: [
    "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区",
    "品川区", "目黒区", "大田区", "世田谷区", "渋谷区", "中野区", "杉並区", "豊島区",
    "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区", "八王子市",
    "立川市", "武蔵野市", "三鷹市", "青梅市", "府中市", "昭島市", "調布市", "町田市",
    "小金井市", "小平市", "日野市", "東村山市", "国分寺市", "国立市", "福生市",
    "狛江市", "東大和市", "清瀬市", "東久留米市", "武蔵村山市", "多摩市", "稲城市",
    "羽村市", "あきる野市", "西東京市",
  ],
  千葉県: [
    "千葉市", "銚子市", "市川市", "船橋市", "館山市", "木更津市", "松戸市", "野田市",
    "茂原市", "成田市", "佐倉市", "東金市", "旭市", "習志野市", "柏市", "勝浦市",
    "市原市", "流山市", "八千代市", "我孫子市", "鴨川市", "鎌ケ谷市", "君津市",
    "富津市", "浦安市", "四街道市", "袖ケ浦市", "八街市", "印西市", "白井市",
    "富里市", "南房総市", "匝瑳市", "香取市", "山武市", "いすみ市", "大網白里市",
  ],
};

function ContactsPage() {
  const [contacts, setContacts] = useState([]); // 一覧データ
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラー表示用
  const [editingContact, setEditingContact] = useState(null); // 編集中のデータ
  const [categories, setCategories] = useState([]); // カテゴリ一覧
  const [users, setUsers] = useState([]); // 担当者一覧

  // 初回データ読み込み
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const [contactsRes, categoriesRes, usersRes] = await Promise.all([
          fetch("http://localhost:8080/api/contacts"),
          fetch("http://localhost:8080/api/categories"),
          fetch("http://localhost:8080/api/users"),
        ]);

        if (!contactsRes.ok) throw new Error(`お問い合わせの取得に失敗！ status: ${contactsRes.status}`);
        if (!categoriesRes.ok) throw new Error(`カテゴリの取得に失敗！ status: ${categoriesRes.status}`);
        if (!usersRes.ok) throw new Error(`担当者の取得に失敗！ status: ${usersRes.status}`);

        const contactsData = await contactsRes.json();
        const categoriesData = await categoriesRes.json();
        const usersData = await usersRes.json();

        setContacts(contactsData.data ?? contactsData);
        setCategories(categoriesData.data ?? categoriesData);
        setUsers(usersData.data ?? usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // 削除処理
  const handleDelete = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`削除に失敗しました！ status: ${res.status}`);
      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // 更新（保存）処理
  const handleUpdate = async () => {
    if (!window.confirm("本当に更新しますか？")) return;
    try {
      // 触った場合と触らなかった場合、どちらでも確実にIDを取得する安全対策
      const targetCategoryId = editingContact.category?.id ?? editingContact.category_id;
      const targetUserId = editingContact.assigned_user?.id ?? editingContact.assigned_user_id;

      const res = await fetch(`http://localhost:8080/api/contacts/${editingContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingContact.name,
          email: editingContact.email,
          prefecture: editingContact.prefecture,
          city: editingContact.city,
          message: editingContact.message,
          category_id: targetCategoryId || null,
          assigned_user_id: targetUserId || null,
        }),
      });
      if (!res.ok) throw new Error(`更新に失敗しました！ status: ${res.status}`);

      // 最新の「塊（オブジェクト）」をマスターデータから再度探し出して確定させる
      const UpdatedCategory = targetCategoryId ? categories.find((c) => c.id === Number(targetCategoryId)) : null;
      const UpdatedUser = targetUserId ? users.find((u) => u.id === Number(targetUserId)) : null;

      // 一覧画面のデータを書き換える
      setContacts(
        contacts.map((contact) =>
          contact.id === editingContact.id
            ? {
                ...contact,
                ...editingContact,
                category: UpdatedCategory ?? null,
                assigned_user: UpdatedUser ?? null,
              }
            : contact
        )
      );

      setEditingContact(null); // フォームを閉じる
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className={styles.loading}>読み込み中...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>お問合せ一覧({contacts.length}件)</h1>

      {error && <p className={styles.error}>エラー：{error}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>メール</th>
            <th>カテゴリ</th>
            <th>担当者</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.empty}>データがありません</td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>
                  <span className={styles.badge}>{contact.category?.name ?? "未分類"}</span>
                </td>
                <td>{contact.assigned_user?.name ?? "未対応"}</td>
                <td>
                  <button className={styles.editButton} onClick={() => setEditingContact(contact)}>
                    編集
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(contact.id)}>
                    削除
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 編集フォーム */}
      {editingContact && (
        <div className={styles.editForm}>
          <h2>お問い合わせID: {editingContact.id} を編集</h2>
          <label>
            名前:
            <input
              type="text"
              value={editingContact.name}
              onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
            />
          </label>
          <label>
            メール:
            <input
              type="email"
              value={editingContact.email}
              onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
            />
          </label>
          <label>
            都道府県:
            <select
              value={editingContact.prefecture ?? ""}
              onChange={(e) =>
                setEditingContact({ ...editingContact, prefecture: e.target.value, city: "" })
              }
            >
              <option value="">選択してください</option>
              {Object.keys(cityData).map((pref) => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </label>

          <label>
            市区町村:
            <select
              value={editingContact.city ?? ""}
              onChange={(e) => setEditingContact({ ...editingContact, city: e.target.value })}
            >
              <option value="">選択してください</option>
              {(cityData[editingContact.prefecture] ?? []).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </label>

          <label>
            お問い合わせ内容:
            <textarea
              value={editingContact.message ?? ""}
              onChange={(e) => setEditingContact({ ...editingContact, message: e.target.value })}
            />
          </label>

          <label>
            カテゴリ:
            <select
              value={editingContact.category?.id ?? editingContact.category_id ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setEditingContact({
                  ...editingContact,
                  category_id: val || null,
                  category: val ? categories.find((c) => c.id === Number(val)) : null,
                });
              }}
            >
              <option value="">未分類</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <label>
            担当者:
            <select
              value={editingContact.assigned_user?.id ?? editingContact.assigned_user_id ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setEditingContact({
                  ...editingContact,
                  assigned_user_id: val || null,
                  assigned_user: val ? users.find((u) => u.id === Number(val)) : null,
                });
              }}
            >
              <option value="">未対応</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </label>

          <div className={styles.editFormButtons}>
            <button className={styles.updateButton} onClick={handleUpdate}>
              更新する
            </button>
            <button className={styles.cancelButton} onClick={() => setEditingContact(null)}>
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsPage;