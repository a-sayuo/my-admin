import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    await axios.get("http://localhost:8080/sanctum/csrf-cookie", {
      withCredentials: true,
    });

    await axios.post("http://localhost:8080/api/login", { email, password }, { withCredentials: true });

    alert("ログイン送信完了");
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>メールアドレス</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <label>パスワード</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button type="submit">ログイン</button>
    </form>
  );
}
