import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import SignUp from './components/Signup';
import Login from './components/Login';


function App() {
  // todo入力フォームの状態管理
  const [todoItem, setTodoItem] = useState({title: '', text: ''});
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
    } else if(selectElement.value === "start") {
      listItem.style.borderColor = "yellow";
      listItem.style.borderWidth = "3px";
    } else if(selectElement.value === "finish") {
      // todoを完了にすると、完了Todoへ移される
      handleFinishTodo(event, index);
      listItem.style.borderColor = "green";
      listItem.style.borderWidth = "2px";
    }

    const updatedTodoList = [...todoList];
    updatedTodoList[index].state = selectElement.value;
    setTodoList(updatedTodoList);
  }

  // 編集機能
  const handleTodoEdit = (todo, index) => {
    // まず、inputのタイトルと内容に移す(この際、todoを引数にし、タイトルと内容を受け取る)
    setTodoItem({title: todo.title, text: todo.text});
  }

  // 完了Todo追加機能
  // 完了でTodoリストから削除する機能と、完了Todoに追加することができない。。。。！！！
  const handleFinishTodo = (event, index) => {
    const selectElement = event.target;
    const listItem = selectElement.parentElement;
    console.log(selectElement);
    console.log(listItem);
    // const listItemParts = {title: listItem.title, text: listItem.text}
    // console.log(listItemParts);
    // 完了に変更されたindexのものを抽出
    setFinishTodoList([...finishTodoList, listItem]);
  }

  return (
    <>
      <div>
        <SignUp />
        <Login />
      </div>
      <div className="todo-input-wrapper">
        <button>ログアウト</button>
        <p className="todo-title">Todoアプリ</p>
        <form class="todo-title-form">
          <label>Todoタイトル</label>
          <input type="text" className="todo-title-text" value={todoItem.title} onChange={handleInputTodoTitle} />
        </form>
        <form className="todo-content-form">
          <label>Todoの内容</label>
          <input type="text" className="todo-input-text" value={todoItem.text} onChange={handleInputText} />
        </form>
        <button onClick={() => {
            handleTodoTaskAdd();
          }}>todoの追加</button>
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
                  <button onClick={() => handleTodoEdit(todo, index)} className="edit-button">todoの編集</button>
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
  )
}

export default App;