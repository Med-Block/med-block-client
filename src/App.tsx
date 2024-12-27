import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LogInLayout from './layouts/LogInLayout/LogInLayout'
import UserDisplayLayout from './layouts/UserDisplay/UserDisplayLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserDisplayLayout />}>
          <Route index element={<></>} />
        </Route>
        <Route path="/log-in" element={<LogInLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
