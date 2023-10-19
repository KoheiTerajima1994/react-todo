import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  // useStateで状態管理
  const [inputTodoTitle, setInputTodoTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [titleLists, setTitleLists] = useState([]);
  const [todoLists, setTodoLists] = useState([]);

  const handleInputTodoTitle = (e) => {
    setInputTodoTitle(e.target.value);
  }

  const handleInputText = (e) => {
    setInputText(e.target.value);
  }

  const handleTodoTitleAdd = () => {
    const newTodoTitle = [...titleLists, inputTodoTitle];
    setTitleLists(newTodoTitle);
    setInputTodoTitle('');
  }

  const handleTodoTaskAdd = () => {
    // 押すと、タスクリストに追加されていく
    //  todoListの配列にinputの値を追加したい
    const newTodos = [...todoLists, inputText];
    setTodoLists(newTodos);
     // 入力した値をinputから削除
     setInputText('');
  }

  const handleTodoDelete = (index) => {
    // 押すと、タスクリストから消える
    const newTodos = [...todoLists];
    const newTodoTitles = [...titleLists]
    newTodos.splice(index, 1);
    setTodoLists(newTodos);
    newTodoTitles.splice(index, 1);
    setTodoLists(newTodoTitles);
  }

  // uuidの生成
  const uuid = uuidv4();

  return (
    <>
      {/* inputに入力したものをタスクに追加 */}
      <div class="todo-input-wrapper">
        <p className="todo-title">Todoアプリ</p>
        <form class="todo-title-form">
          <label>Todoタイトル</label>
          <input type="text" className="todo-title-text" value={inputTodoTitle} onChange={handleInputTodoTitle}  />
        </form>
        <form class="todo-content-form">
          <label>Todoの内容</label>
          <input type="text" className="todo-input-text" value={inputText} onChange={handleInputText} />
        </form>
        <button onClick={() => {
          if(inputTodoTitle && inputText) {
            handleTodoTitleAdd();
            handleTodoTaskAdd();
          }
          }}>todoの追加</button>
      </div>

      <div className="todo-task-wrapper">
        <p className="todolist-label">Todoリスト</p>
        <ul>
          {todoLists.map((todo, index) => {
            const title = titleLists[index];
            return (
              <li key={uuid} className="task-list">
                <p>タイトル：{title}</p>
                <p>Todo内容：{todo}</p>
                <button onClick={() => handleTodoDelete(index)} className="delete-button">todoの削除</button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default App;
