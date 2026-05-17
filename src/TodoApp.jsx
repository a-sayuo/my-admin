import { useState } from 'react';
import styles from './TodoApp.module.css';

function TodoApp() {
    //ToDo一覧（配列）を状態として管理
  const [todos, setTodos] = useState([
    { id: 1, text: 'Reactを学ぶ', done: false },
    { id: 2, text: 'コンポーネントを作る', done: true },
  ])

    //入力欄の文字列（ToDo）を状態として管理
  const [inputText, setInputText] = useState('');

    //①追加する処理
    const handleAdd = () => {
        if (inputText === '') return; //空なら何もしない

        const newTodo = {
            id: Date.now(), //被らないidとして現在時刻を使う
            text: inputText,
            done: false,
        };
        setTodos([...todos, newTodo]); //新しいToDoを追加
        setInputText(''); //入力欄を空にする
    }

    //②完了/未完了を切り替える処理
    const handleToggle = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id 
                ? { ...todo, done: !todo.done }  //対象のdoneを反転
                : todo                        //他はそのまま
            )
        );
    }

    //③削除する処理
    const handleDelete = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id)); //対象以外を残す
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>ToDoリスト</h1>

            {/* 入力エリア */}
            <div className={styles.inputRow}>
                <input
                    className={styles.input}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="やることを入力"
                />
                <button className={styles.button} onClick={handleAdd}>
                    追加
                </button>
            </div>

            {/* ToDo一覧表示 */}
            <ul className={styles.List}>
                {todos.map((todo) => (
                    <li key={todo.id} className={styles.item}>
                        <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() => handleToggle(todo.id)}
                        />
                        <span className={`${styles.itemText} ${todo.done ? styles.done : ''}`}>
                            {todo.text}
                        </span>
                        <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(todo.id)}
                        >削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoApp
