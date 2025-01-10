import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux';
import { reduxStore } from './redux/store';
import LogInLayout from './layouts/LogInLayout/LogInLayout'
import UserDisplayLayout from './layouts/UserDisplay/UserDisplayLayout'
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import UserAdminLayout from './layouts/UserAdminLayout/UserAdminLayout';
import EditUserLayout from './layouts/EditUserLayout/EditUserLayout';
import SettingsLayout from './layouts/SettingsLayout/SettingsLayout';
import DoctorBrowseLayout from './layouts/DoctorBrowseLayout/DoctorBrowseLayout';
import DoctorsWithLicenseLayout from './layouts/DoctorsWithLicenseLayout/DoctorsWithLicenseLayout';
import AllDoctorsLayout from './layouts/AllDoctorsLayout/AllDoctorsLayout';
import AdminLicenseHistoryLayout from './layouts/AdminLicenseHistoryLayout/AdminLicenseHistoryLayout';
import RecordsLayout from './layouts/RecordsLayout/RecordsLayout';
import EditRecordLayout from './layouts/EditRecordLayout/EditRecordLayout';

function App() {
    return (
        <ReduxProvider store={reduxStore}>
            <BrowserRouter>
                <Routes>
                    <Route path='' element={<UserDisplayLayout />}>
                        <Route index element={<></>} />
                        <Route path='my-records' element={<></>} />
                        <Route path='doctors' element={<DoctorBrowseLayout />}>
                            <Route index element={<></>} />
                            <Route path='with-license' element={<DoctorsWithLicenseLayout />} />
                            <Route path='all' element={<AllDoctorsLayout />} />
                        </Route>
                        <Route path='settings' element={<SettingsLayout />} />
                        <Route path='admin' element={<AdminLayout />}>
                            <Route index element={<></>} />
                            <Route path='users' element={<UserAdminLayout />} />
                            <Route path='license-history' element={<AdminLicenseHistoryLayout />} />
                        </Route>
                        <Route path='edit-user' element={<EditUserLayout />} />
                        <Route path='edit-record' element={<EditRecordLayout />} />
                        <Route path='records' element={<RecordsLayout />} />
                    </Route>
                    <Route path="log-in" element={<LogInLayout />} />
                </Routes>
            </BrowserRouter>
        </ReduxProvider>
    )
}

export default App
