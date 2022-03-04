
import {Routes, Route} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/login' element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App;
