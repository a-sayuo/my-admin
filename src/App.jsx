//別ファイルのコンポーネントをインポート
import ProfileCard from './ProfileCard';

// App の中で使う
function App() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>スタッフ一覧</h1>
      <div style={{ display: 'flex', gap: '16px' }}>
        <ProfileCard name="山田春次郎" role="管理者" />
        <ProfileCard name="鈴木一郎" role="一般ユーザー" />
        <ProfileCard name="田中太郎" role="閲覧者" />
      </div>
    </div>
  );
}

export default App;
