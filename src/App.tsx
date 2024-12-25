import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LogInLayout from './layouts/LogInLayout/LogInLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log-in" element={<LogInLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
