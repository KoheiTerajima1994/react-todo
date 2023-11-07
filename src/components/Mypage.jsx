import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../App.css';

const Mypage = () => {

  {/* ログイン・ログアウト関連 */}
    // ログイン情報の管理
    const [user, setUser] = useState("");

    // loadingを定義し、ログインの判定をする前にリダイレクトされてしまうのを防ぐ
     const [loading, setLoading] = useState(true);

    // ログイン判定処理
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        setLoading(false);
    });

    // ログアウト処理
    const navigate = useNavigate();
    const logout = async () => {
      await signOut(auth);
      alert('aaa');
      navigate('/login');
    }

    {/* Todo状態保持、更新関連 */}
    // todo入力フォームの状態管理(id,editingは、todo編集時に使用)
    const [todoItem, setTodoItem] = useState({id: '', title: '', text: '', editing: false});
    // todoリストの状態管理
    const [todoList, setTodoList] = useState([]);
    // 完了todoリストの状態管理
    const [finishTodoList, setFinishTodoList] = useState([]);

    {/* テキスト入力処理 */}
    const textInputProcess = (e, property) => {
      setTodoItem({...todoItem, [property]: e.target.value})
    }

    {/* todo削除処理(共通化) */}
    const todoDelete = (index, ex, setEx) => {
      const renewTodos = [...ex];
      renewTodos.splice(index, 1);
      setEx(renewTodos);
    }

    {/* todoリスト追加処理 */}
    const handleTodoTaskAdd = () => {
      // タイトルと内容どちらも入力されている場合
      if(todoItem.title && todoItem.text) {
        // uuid取得
        const uniqueKey = uuidv4();
  
        // idとタイトルと内容を取得
        const newTodoItem = { id: uniqueKey, title: todoItem.title, text: todoItem.text };
  
        //  inputにて入力したタイトルと内容をtodoListに追加
        setTodoList([...todoList, newTodoItem]);
  
        // inputの内容を初期値に戻す
        setTodoItem({title: '', text: ''});
      }
    }

    {/* todoリスト タスク状態による色分け処理 */ }
    // セレクトボックスが変わるごとに発動
    const stateStyleChange = (event, index) => {
      // セレクトボックスの取得
      const selectElement = event.target;
      // タスク自体の取得
      const listItem = selectElement.parentElement;

      if(selectElement.value === "not-start") {
        // 状態に応じて枠線を追加
        listItem.style.borderColor = "red";
        listItem.style.borderWidth = "4px";
      } else if(selectElement.value === "start") {
        listItem.style.borderColor = "yellow";
        listItem.style.borderWidth = "3px";
      } else if(selectElement.value === "finish") {
        // todoを完了にすると、完了Todoへ移される
        handleFinishTodo(index);
      }
    }
  
    {/* todoリスト 編集処理 */ }
    const handleTodoEdit = (todo) => {
      // inputのタイトルと内容に移す(todoListから該当todoのみを取得)
      setTodoItem({id: todo.id, title: todo.title, text: todo.text, editing: true});
    }

    {/* todo 編集完了処理 */ }
    const handleFinishEdit = (id) => {
      // 編集したtodoをtodoListに戻す処理
      const updatedTodoList = todoList.map((todo) => {
        // todoListの中でtodoItemのidが編集中のものと一致したならば、書き換え(プロパティーをコピーし、上書き)
        if(todo.id === id) {
          return { ...todo, title: todoItem.title, text: todoItem.text, editing: false };
        }
        return todo;
      });
      setTodoList(updatedTodoList);
      // inputの内容を初期値に戻す
      setTodoItem({id: '', title: '', text: '', editing: false});
    }
  
    {/* 完了todoへの追加、todoリストからの削除処理 */ }
    const handleFinishTodo = (index) => {
      // todoListの中で「finish」状態のオブジェクトを取得
      const finishTodoItem = {id: todoList[index].id, title: todoList[index].title, text: todoList[index].text};
      // 取得したオブジェクトを完了todoに追加
      setFinishTodoList([...finishTodoList, finishTodoItem]);
      // todoListから削除
      todoDelete(index, todoList, setTodoList);
    }

    {/* 完了todoからtodoリストに戻す処理 */ }
    const handleFinishTodoReturn = (index) => {
      // finishTodoListの中から該当オブジェクトを取得
      const returnTodoItem = {id: finishTodoList[index].id, title: finishTodoList[index].title, text: finishTodoList[index].text};
      // todoListへ該当オブジェクトを追加
      setTodoList([...todoList, returnTodoItem]);

      // 完了Todoから削除
      todoDelete(index, finishTodoList, setFinishTodoList);
    }

    return (
        <>
        {!loading && (
          <>
            {!user ? (
          <>
            <Navigate to={`/login`} />
          </>
        ) : (
          <>
            <p>{user && user.email}さん、こんにちは！</p>
            <button onClick={logout}>ログアウト</button>
            <div className="todo-input-wrapper">
              <h1 className="todo-title">Todoアプリ</h1>
              <form className="todo-title-form">
                <label>Todoタイトル</label>
                <input type="text" className="todo-title-text" value={todoItem.title} onChange={(e) => textInputProcess(e, "title")} />
              </form>
              <form className="todo-content-form">
                <label>Todoの内容</label>
                <input type="text" className="todo-input-text" value={todoItem.text} onChange={(e) => textInputProcess(e, "text")} />
              </form>
              <div className="button-flex">
                <button onClick={() => {
                  if(todoItem.editing) {
                    handleFinishEdit(todoItem.id);
                  } else {
                    handleTodoTaskAdd();
                  }
                }}>{todoItem.editing ? '編集完了' : 'todoの追加'}</button>
              </div>
            </div>
      
            <div className="todo-task-wrapper">
              <p className="todolist-label">Todoリスト</p>
              <p><span style={{color: 'red'}}>赤枠：未着手</span>　<span style={{color: 'yellow'}}>黄枠：進行中</span></p>
              <ul>
                {todoList.map((todo, index) => {
                  const uniqueTaskClass = `todo-state-${index}`;
                  return (
                    <li key={todo.id} className="task-list">
                      <p>タイトル：{todo.title}</p>
                      <p>Todo内容：{todo.text}</p>
                      <select name="todo-state" className={`todo-state ${uniqueTaskClass}`} onChange={(event) => stateStyleChange(event, index)}>
                        <option value="not-start">未着手</option>
                        <option value="start">進行中</option>
                        <option value="finish">完了</option>
                      </select>
                      <div className="button-flex">
                        <button onClick={() => handleTodoEdit(todo)} className="edit-button">todoの編集</button>
                        <button onClick={() => todoDelete(index, todoList, setTodoList)} className="delete-button">todoの削除</button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
      
            <div className="todo-finish-wrapper">
              <p className="todofinishlist-label">完了Todo</p>
              <ul>
                {finishTodoList.map((todo, index) => {
                  return (
                    <li key={todo.id} className="finish-task-list">
                      <p>タイトル：{todo.title}</p>
                      <p>Todo内容：{todo.text}</p>
                      <div className="button-flex02">
                        <button onClick={() => handleFinishTodoReturn(index)}>todoをリストに戻す</button>
                        <button onClick={() => todoDelete(index, finishTodoList, setFinishTodoList)}>todoを削除する</button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )}
          </>
        )}
        </>
    )
}
export default Mypage;