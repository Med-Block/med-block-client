import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux';
import { reduxStore } from './redux/store';
import LogInLayout from './layouts/LogInLayout/LogInLayout'
import UserDisplayLayout from './layouts/UserDisplay/UserDisplayLayout'

function App() {
  return (
    <ReduxProvider store={reduxStore}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UserDisplayLayout />}>
            <Route index element={<></>} />
            <Route path='my-records' element={<></>} />
            <Route path='owned-licenses' element={<></>} />
            <Route path='given-licenses' element={<></>} />
            <Route path='doctors' element={<></>} />
            <Route path='administration' element={<></>}>
              <Route index element={<></>} />
              <Route path='users' element={<></>} />
              <Route path='license-history' element={<></>} />
            </Route>
          </Route>
          <Route path="log-in" element={<LogInLayout />} />
        </Routes>
      </BrowserRouter>
    </ReduxProvider>
  )
}

export default App
