import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux';
import { reduxStore } from './redux/store';
import LogInLayout from './layouts/LogInLayout/LogInLayout'
import UserDisplayLayout from './layouts/UserDisplay/UserDisplayLayout'
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import UserAdminLayout from './layouts/UserAdminLayout/UserAdminLayout';
import EditUserLayout from './layouts/EditUserLayout/EditUserLayout';
import SettingsLayout from './layouts/SettingsLayout/SettingsLayout';

function App() {
    return (
        <ReduxProvider store={reduxStore}>
            <BrowserRouter>
                <Routes>
                    <Route path='' element={<UserDisplayLayout />}>
                        <Route index element={<></>} />
                        <Route path='my-records' element={<></>} />
                        <Route path='owned-licenses' element={<></>} />
                        <Route path='given-licenses' element={<></>} />
                        <Route path='doctors' element={<></>} />
                        <Route path='settings' element={<SettingsLayout />} />
                        <Route path='admin' element={<AdminLayout />}>
                            <Route index element={<></>} />
                            <Route path='users' element={<UserAdminLayout />} />
                            <Route path='license-history' element={<></>} />
                        </Route>
                        <Route path='edit-user' element={<EditUserLayout />} />
                    </Route>
                    <Route path="log-in" element={<LogInLayout />} />
                </Routes>
            </BrowserRouter>
        </ReduxProvider>
    )
}

export default App
