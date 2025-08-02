import { useState, useEffect } from 'react';
import localforage from 'localforage'

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

type Filter = 'all' | 'completed' | 'unchecked' | 'delete'; // <-- 追加

// Todos コンポーネントの定義
const Todos: React.FC = () => {
  // 以下の①のコードが、登録済みのタスクも含む保管場所となった為以下の②が元の①の代わりとなるコードです。
  // 元の①のコード：const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]); // Todoの配列を保持するステート①
  const [text, setText] = useState(''); // 入力されたテキストを保持するステート②
  const [nextId, setNextId] = useState(1); // 次のタスクIDを保持するステート③
  const [filter, setFilter] = useState('all');

  //useEffect フックを使ってコンポーネントのマウント時にデータを取得
  useEffect(() => {
    localforage.getItem('todo-20240622').then((values) => {
      if (values) {
        setTodos(values as Todo[]);
      }
    })
  }, [])

  // useEffect フックを使って todos ステートが更新されるたびにデータを保存
  useEffect(() => {
    localforage.setItem('todo-20240622', todos);
  }, [todos]);

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
  
  const handleEdit = (id: number, value: string) => {
    //console.log('handleEdit called', id, title)
    setTodos((todos) => {
      /**
       * 引数として渡された todo の id が一致する
       * 更新前の todos ステート内の
       * value(プロパティ)を引数 value(= e.target.value に置き換える
       */
      /* todos の中身は配列に格納された、多数のjavascritpオブジェクト
      　　　それを一つ一つのjavascriptオブジェクトとして取り出してる
      */
      /*const newTodos = todos.map((todo) => {
        if(todo.id === id){
          // 新しいオブジェクトを作成して返す
          return {...todo, title: title}
        }
        return todo;
      })*/
      // todos ステートが書き換えられていないかチェック
      /*console.log('=== Original todos ===')
      todos.map((todo) => {
        console.log(`id: ${todo.id}, titel: ${todo.title}`)
      })
      return newTodos;*/

      //上記の同じ様なコードをやめて、下部のupdateTodoを活用して簡潔化する。
      return  updateTodo(todos, id, 'title',value)
    });
  }
  const handleCheck = (id: number, completed_flg: boolean) => {
    setTodos((todos) => {
      /*const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {...todo, completed_flg};
        }
        return todo;
      })*/

      /* 最終的には更新した newTodos(todos)を
        setTodosに格納することで、todosが更新される
      */
      //return newTodos;
      //上記の同じ様なコードをやめて、下部のupdateTodoを活用して簡潔化する。
      return  updateTodo(todos, id, 'completed_flg',completed_flg);
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
      /*const newTodos = todos.map((todo) => {
        if (todo.id === id){
          return {...todo, delete_flg};
        }
        return todo
      })
      return newTodos;*/

      //上記の同じ様なコードをやめて、下部のupdateTodoを活用して簡潔化する。
      return  updateTodo(todos, id, 'delete_flg',delete_flg)
    })
  }
 //filter:Filter はfilterという変数の型にtype Filterで設定したFilterを設定するという意味
  const handleFilterChange = (filter: Filter) => {
    setFilter(filter); 
    //console.log(filter) 
  }

  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed':
        // 完了済み **かつ** 削除されていないタスクを返す
        /*⭐️filterメソッド と mapメソッド の違い
          filter メソッド: 🌼ある条件を満たす要素だけを集めたい🌼 場合に使用
          map メソッド: 🌷全ての要素に何らかの処理を施したい🌷 場合に使用
        　*/
        return todos.filter((todo) => todo.completed_flg && !todo.delete_flg);
      case 'unchecked':
        // 未完了 **かつ** 削除されていないタスクを返す
        return todos.filter((todo) => !todo.completed_flg && !todo.delete_flg);
      case 'delete':
        // 削除されたタスクを返す
        return todos.filter((todo) => todo.delete_flg);
      default:
        // 削除されていないすべてのタスクを返す
        return todos.filter((todo) => !todo.delete_flg)
    }
  }
  
  const isFormDisabled= filter === 'completed' || filter === 'delete';

  // 物理的に削除する関数
  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.delete_flg));
  };
  /*
    const updateTodo = <T extends keyof Todo>(todos: Todo[], id: number, key: T, value: Todo[T]): Todo[] => … を要素ごとに分解すると、こうなります。

      1.const updateTodo = …
      ‐ 関数名を updateTodo として定数に代入しています。
      ‑ function updateTodo(…) { … } と同じ役割です。

      2.<T extends keyof Todo>
      ‑ これは ジェネリック型パラメータ の宣言です。
      ‑ T は Todo 型のキー（"content" | "id" | "completed_flg" | "delete_flg"）のいずれか、という制約を持ちます。
      ‑ つまり「T は Todo のプロパティ名である」という意味です。
      ‑ 「T は必ず Todo のプロパティ名（keyof Todo）のいずれかである」
      ‑ つまり、後続の引数 key: T や value: Todo[T] に渡せる内容を、型レベルで安全に限定しています
      ‑ ⭐️🌕🌷ジェネリック型パラメータの制限⭐️🌕🌷

      3.(todos: Todo[], id: number, key: T, value: Todo[T])
      ‒ todos: Todo[]
      　　関数に渡す「更新対象の Todo 配列」。
      ‒ id: number
      　　どの Todo を更新するかを識別するための ID。
      ‒ key: T
      　　更新したいプロパティ名（T で型制約済）。
      ‒ value: Todo[T]
      　　更新後の値。key に対応した型（Todo[T]）である必要があります。

      4.: Todo[]
      ‑ この関数が戻す値の型注釈です。
      ‑ 「更新後の新しい Todo 配列」を返します。

      5.=> { … }
      ‑ アロー関数の本体。この中で例えば以下のように実装します
  */
 //よく似た関数をジェネリックを活用してコンパクトに1まとめ
  const updateTodo = <T extends keyof Todo>(todos: Todo[], id: number, key: T, value: Todo[T]):Todo[] => {
    return todos.map((todo) => {
      if (todo.id === id) {
        /*[key]の意味
          key: T keyにはTが入ってくる
          Tっていうのが、<T extends keyof Todo>によって
          Todo 型のキー（"title" | "id" | "completed_flg" | "delete_flg"）のいずれかとなる。つまり文字列となる。しかし、[key]とすることで、key が "completed_flg" なら { …todo, completed_flg: value } になる、というわけです。
        */
        return {...todo, [key]: value};
      }
      return todo;
    })
  }
  //値の更新関数にはupdateTodoを中に組み込みupdateTodoを実行させる外側の関数にhndleTodoを活用する
  /*// K extends keyof Todo
  //   → K は Todo の「キー名」のいずれか（"title"|"id"|"completed_flg"|"delete_flg"）を表す型
  // V extends Todo[K]
  //   → V は、「そのキーが持つ値の型」を表す。
  //      例えば K = "title" のとき V は string、
  //                K = "completed_flg" のとき V は boolean になる
  これにより、handleTodo(todo.id, 'title', '新しいタイトル') のように呼ぶと
  'title' を選ぶと自動的に value が string 型であること
  'completed_flg' を選ぶと自動的に value が boolean 型であること
  を 型レベルで保証 できます。*/
  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => updateTodo(todos, id, key, value))
  }

  return (
    <div className="todo-container">
      <select 
        defaultValue="all" 
        onChange={(e) => handleFilterChange(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="completed">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="delete">ゴミ箱</option>
      </select>
      {/* フィルターが 'delete' のときは 「ごみ箱を空にする」 ボタンを表示 */}
      {filter === 'delete' ? (
        <button className="btn btn-light" onClick={handleEmpty}>
          ごみ箱を空にする
        </button>
      ) : (
        // フィルターが 'completed' でなければ Todo 入力フォームを表示
        filter !== 'completed' && (     
          <form 
            onSubmit={(e) => {
              e.preventDefault();// フォームのデファルト動作を防ぐ
              handleSubmit();// handleSubmit 関数を呼び出す
            }}
          >
            <input 
              type="text" 
              value= {text} // フォームの入力値をステートにバインド
              disabled= {isFormDisabled}
              onChange={(e) => setText(e.target.value)}// フォームの入力値が変わった時ににステートを更新 
              placeholder="タスクを入力してください"
            />
            <button className="insert-btn" type="submit" disabled= {filter === 'completed' || filter === 'delete'}>追加</button>{/*このボタンはtype="submit"なので、クリックするとフォームのonSubmitイベントをトリガーします */}
            <button className="btn btn-outline-primary ms-1" onClick={() => addDefault()} >テストに使うタスクを作成</button>
          </form>
        )
      )}
      <ul>
        {getFilteredTodos().map((todo) => (
          <li key={todo.id}>
            <input 
              type="checkbox" 
              checked={todo.completed_flg}
              // 呼び出し側で checked フラグを反転させる
              onChange={() => handleTodo(todo.id, 'completed_flg', !todo.completed_flg)}
            />
            <input 
              type="text"
              value={todo.title}
              disabled={isFormDisabled}
              onChange={(e) => handleTodo(todo.id, 'title', e.target.value)}
             />
             <button className="" onClick={() => handleTodo(todo.id, 'delete_flg', !todo.delete_flg)}>
              {todo.delete_flg ? '復元' : '削除'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;