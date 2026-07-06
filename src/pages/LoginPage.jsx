import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 必須設定：クッキーを毎回一緒に送信する設定]
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.get("http://localhost:8080/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const response = await axios.post(
        "http://localhost:8080/api/login",
        { email, password },
        { withCredentials: true },
      );

      alert("ログイン成功");
      console.log(response.data);
      navigate("/contacts"); // ログイン成功後にリダイレクトするページ
    } catch (err) {
      console.error("ログインエラー:", err);
      alert("ログインに失敗～コンソールを確認して！");
    }
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
