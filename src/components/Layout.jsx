import { NavLink } from "react-router-dom";
import styles from "./Layout.module.css";

// ナビゲーションのリンクデータ
const navItems = [
  { path: "/", label: "ダッシュボード" },
  { path: "/users", label: "ユーザー管理" },
  { path: "/settings", label: "設定" },
];

function Layout({ children }) {
  return (
    <div className={styles.container}>
      {/* サイドバー */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>⚙ MyAdmin</div>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* メインエリア */}
      <div className={styles.main}>
        <header className={styles.header}>MyAdmin 管理画面</header>
        <main className={styles.content}>
          {children} {/* ←各ページの中身がここに入る */}
        </main>
      </div>
    </div>
  );
}

export default Layout;
