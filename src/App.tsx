import { useState } from 'react'
import './App.css'
import { decrease, increase } from './utils.ts';

function App() {
  const [count, setCount] = useState(0);
  // const [greet, setGreet] = useState('');

  // useEffect(() => {
  //   axios.get('http://localhost:8000/api/greet').then(res => {
  //     setGreet(res.data?.message || '');
  //   });
  // }, []);

  return (
    <div className="card">
      <div>{count}</div>
      <button onClick={() => setCount(count => increase(count))}>증가</button>
      <button onClick={() => setCount(count => decrease(count))}>감소</button>
      {/*{greet && <p data-testid="greet">{greet}</p>}*/}
      허숙희
    </div>
  )
}

export default App
