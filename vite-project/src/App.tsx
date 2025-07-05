import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Todos from './components/todos/index'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
    <Todos /> {/* Todosコンポーネントをレンダリング */}
   </>
  )
}

export default App
