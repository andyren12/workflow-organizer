import Navbar from './Navbar'
import Home from './Home'
import Calendar from './Calendar'
import Timer from './Timer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/timer' element={<Timer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
