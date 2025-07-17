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
  completed_flg: boolean;// 今回の追加
  delete_flg:boolean;// 追加
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
      // 初期値は false
      completed_flg:false,
      delete_flg:false, // <--  追加
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
  const handleCheck = (id: number, completed_flg: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {...todo, completed_flg};
        }
        return todo;
      })

      /* 最終的には更新した newTodos(todos)を
        setTodosに格納することで、todosが更新される
      */
      return newTodos;
    })
  }
  const addDefault = () => {
    // デフォルトで一気に追加したい Todo を配列で作る
    const defaultTodos: Todo[] = [
      { title: 'テスト_タスク_1', id: nextId,       completed_flg: false, delete_flg:false },
      { title: 'テスト_タスク_2', id: nextId + 1,   completed_flg: false, delete_flg:false },
      { title: 'テスト_タスク_3', id: nextId + 2,   completed_flg: false, delete_flg:false },
      // 必要ならさらに増やせます…
    ]

    const reverse: Todo[] = defaultTodos.reverse();

    // 既存の todos の先頭にデフォルトリストをくっつける
    /**
     * ⭐️💡なぜ、defaultTodosは、配列に格納されてるのに実行結果はネストした配列という表示されないのか
     * ...defaultTodos や ...prev のスプレッド構文は、「配列そのもの」を入れるのではなく、「配列の要素」を展開して並べる働きがあります
     */
    //setTodos(prev => [...defaultTodos, ...prev])
    setTodos((prev) => [...reverse, ...prev])

    // nextId を defaultTodos の数だけ進めておく
    setNextId(id => id + defaultTodos.length)
  }

  const handleRemove = (id: number, delete_flg: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id){
          return {...todo, delete_flg};
        }
        return todo
      })
      return newTodos;
    })
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
        <button className="btn btn-outline-primary ms-1" onClick={() => addDefault()}>テストに使うタスクを作成</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input 
              type="checkbox" 
              checked={todo.completed_flg}
              // 呼び出し側で checked フラグを反転させる
              onChange={() => handleCheck(todo.id, !todo.completed_flg)}
            />
            <input 
              type="text"
              value={todo.title}
              disabled={todo.completed_flg}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
             />
             <button className="btn btn-light" onClick={() => handleRemove(todo.id, !todo.delete_flg)}>
              {todo.delete_flg ? '復元' : '削除'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;