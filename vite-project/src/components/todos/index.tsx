import { useState } from 'react';

//Todos コンポーネントの定義
/*React.FC：constによる型定義でコンポーネントを定義できる型
その他の書き方として、JSX.Elementを使用する書き方もある
const Hoge = ({ name }: Props): JSX.Element => {
  return <h1>{name}</h1>;
};
⭐️書かなくてもＯＫ

    const Hoge = ({ name }: Props) => {
    return <h1>{name}</h1>;
    };
    これだけで JSX.Element を返すコンポーネントとして扱われます。

    明示したいときだけ書く
*/
// "Todo" 型の定義をコンポーネント外で行う
type Todo = {
  title: string;// プロパティ content は文字列型
  /*
  key は「どの要素が変わったか、挿入・削除されたか」を素早く正確に見分けるためのヒントであり、結果としてレンダリングの効率と安定性を高めるために必須のもの
   */
  readonly id: number;
};

// Todos コンポーネントの定義
const Todos: React.FC = () => {
  // 以下の①のコードが、登録済みのタスクも含む保管場所となった為以下の②が元の①の代わりとなるコードです。
  // 元の①のコード：const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]); // Todoの配列を保持するステート①
  const [text, setText] = useState(''); // 入力されたテキストを保持するステート②
  const [nextId, setNextId] = useState(1); // 次のタスクIDを保持するステート③

  // todos ステートを更新する関数
  const handleSubmit = () => {
    // 何も入力されていなかったらリターン
    if (!text) return;

    // 新しい Todo を作成
    const newTodo: Todo = {
      title:text, // text ステートの値を content プロパティへ
      id: nextId,
    }

    /**
     * 更新前の todos ステートを元に
     * スプレッド構文で展開した要素へ 
     * newTodo を加えた新しい配列でステートを更新
     */
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setNextId(nextId+1); // 次の ID を更新
    
    // フォームへの入力をクリアする
    setText('');

  };
  
  const handleEdit = (id: number, title: string) => {
    console.log('handleEdit called', id, title)
    setTodos((todos) => {
      /**
       * 引数として渡された todo の id が一致する
       * 更新前の todos ステート内の
       * value(プロパティ)を引数 value(= e.target.value に置き換える
       */
      /* todos の中身は配列に格納された、多数のjavascritpオブジェクト
      　　　それを一つ一つのjavascriptオブジェクトとして取り出してる
      */
      const newTodos = todos.map((todo) => {
        if(todo.id === id){
          // 新しいオブジェクトを作成して返す
          return {...todo, title: title}
        }
        return todo;
      })
      // todos ステートが書き換えられていないかチェック
      console.log('=== Original todos ===')
      todos.map((todo) => {
        console.log(`id: ${todo.id}, titel: ${todo.title}`)
      })
      return newTodos;
    });
  }

  return (
    <div>
      <form 
        onSubmit={(e) => {
          e.preventDefault();// フォームのデファルト動作を防ぐ
          handleSubmit();// handleSubmit 関数を呼び出す
        }}
      >
        <input 
          type="text" 
          value= {text} // フォームの入力値をステートにバインド
          onChange={(e) => setText(e.target.value)}// フォームの入力値が変わった時ににステートを更新 
          placeholder="タスクを入力してください"
        />
        <button className="insert-btn" type="submit">追加</button>{/*このボタンはtype="submit"なので、クリックするとフォームのonSubmitイベントをトリガーします */}
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input 
              type="text"
              value={todo.title}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
             />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;