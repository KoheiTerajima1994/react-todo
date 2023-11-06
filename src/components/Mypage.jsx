import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../App.css';

const Mypage = () => {

    // ログイン情報の管理
    const [user, setUser] = useState("");

    // loadingを定義し、ログインの判定をする前にリダイレクトされてしまうのを防ぐ
     const [loading, setLoading] = useState("");


    // ログインしているかどうかを判定
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        setLoading(false);
    }, []);

    // ログアウトについて
    const logout = async () => {
      await signOut(auth);
      alert('aaaa!!!');
      // ここでうまくいっていない
      Navigate('/login');
    }

    // todo入力フォームの状態管理(idは、todo編集時に使用)
    const [todoItem, setTodoItem] = useState({id: '', title: '', text: '', editing: false});
    // todoリストの状態管理
    const [todoList, setTodoList] = useState([]);
    // 完了todoリストの状態管理
    const [finishTodoList, setFinishTodoList] = useState([]);
  
    // todoリストタイトルに何かしらの入力があった場合
    const handleInputTodoTitle = (e) => {
      setTodoItem({...todoItem, title: e.target.value});
    }
    // todoリストテキストに何かしらの入力があった場合
    const handleInputText = (e) => {
      setTodoItem({...todoItem, text: e.target.value});
    }
  
    // todoリストに追加する
    const handleTodoTaskAdd = () => {
      if(todoItem.title && todoItem.text) {
        const uniqueKey = uuidv4();
  
        const newTodoItem = { id: uniqueKey, title: todoItem.title, text: todoItem.text };
  
        setTodoList([...todoList, newTodoItem]);
  
        setTodoItem({title: '', text: ''});
      }
    }
  
    // todoリストから削除する
    const handleTodoDelete = (index) => {
      // 押すと、タスクリストから消える
      const newTodos = [...todoList];
      newTodos.splice(index, 1);
      setTodoList(newTodos);
    }
    
    // タスク状態の色分け
    const stateStyleChange = (event, index) => {
      const selectElement = event.target;
      const listItem = selectElement.parentElement;
  
      if(selectElement.value === "not-start") {
        listItem.style.borderColor = "red";
        listItem.style.borderWidth = "4px";
        const updatedTodoList = [...todoList];
        updatedTodoList[index].state = selectElement.value;
        setTodoList(updatedTodoList);
      } else if(selectElement.value === "start") {
        listItem.style.borderColor = "yellow";
        listItem.style.borderWidth = "3px";
        const updatedTodoList = [...todoList];
        updatedTodoList[index].state = selectElement.value;
        setTodoList(updatedTodoList);
      } else if(selectElement.value === "finish") {
        // todoを完了にすると、完了Todoへ移される
        handleFinishTodo(event, index);
      }
    }
  
    // 編集機能
    const handleTodoEdit = (todo) => {
      // まず、inputのタイトルと内容に移す(この際、todoを引数にし、idとタイトルと内容を受け取る)
      setTodoItem({id: todo.id, title: todo.title, text: todo.text, editing: true});
    }

    // 編集完了機能
    const handleFinishEdit = (id) => {
      const updatedTodoList = todoList.map((todo) => {
        // todoのidが一致したならば、書き換え
        if(todo.id === id) {
          return { ...todo, title: todoItem.title, text: todoItem.text, editing: false };
        }
        return todo;
      });
      setTodoList(updatedTodoList);

      setTodoItem({id: '', title: '', text: '', editing: false});
    }
  
    // 完了Todo追加機能
    // 完了でTodoリストから削除する機能と、完了Todoに追加することができない。。。。！！！
    const handleFinishTodo = (event, index) => {
      const selectElement = event.target;

      console.log(todoList[index]);

      const newTodos = [...todoList];
      newTodos.splice(index, 1);
      setTodoList(newTodos);

      // const listItem = selectElement.parentElement;
      // console.log(selectElement);
      // console.log(listItem);
      // const listItemParts = {title: listItem.title, text: listItem.text}
      // console.log(listItemParts);
      // 完了に変更されたindexのものを抽出
      // setFinishTodoList([...finishTodoList, listItem]);
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
              <form class="todo-title-form">
                <label>Todoタイトル</label>
                <input type="text" className="todo-title-text" value={todoItem.title} onChange={handleInputTodoTitle} />
              </form>
              <form className="todo-content-form">
                <label>Todoの内容</label>
                <input type="text" className="todo-input-text" value={todoItem.text} onChange={handleInputText} />
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
              <p><span style={{color: 'red'}}>赤枠：未着手</span>　<span style={{color: 'yellow'}}>黄枠：進行中</span>　<span style={{color: 'green'}}>青枠：完了</span></p>
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
                        <button onClick={() => handleTodoDelete(index)} className="delete-button">todoの削除</button>
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
                    <li className="finish-task-list">
                      <p>タイトル：{todo.title}</p>
                      <p>Todo内容：{todo.text}</p>
                      <div className="button-flex02">
                        <button>todoをリストに戻す</button>
                        <button>todoを削除する</button>
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