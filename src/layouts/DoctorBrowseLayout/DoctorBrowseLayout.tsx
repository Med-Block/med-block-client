import React from "react";
import cl from "./.module.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";

const DoctorBrowseLayout: React.FC = () => {
    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();

    React.useEffect(() => {
        if (currentUser?.role !== 'user') {
            navigate('/');
        }
    }, [currentUser?.role, navigate]);

    return (
        <div className={cl.doctor_browse}>
            <nav className={cl.doctor_browse__navigation}>
                <NavLink
                    className={`${cl.doctor_browse__navigation__element} ${window.location.pathname === "/doctors/with-license" ? cl.current : ''}`}
                    to="/doctors/with-license">
                    Doctors with license
                </NavLink>
                <NavLink
                    className={`${cl.doctor_browse__navigation__element} ${window.location.pathname === "/doctors/all" ? cl.current : ''}`}
                    to="/doctors/all">
                    All doctors
                </NavLink>
            </nav>
            <div className={cl.doctor_browse__content}>
                <Outlet />
            </div>
        </div>
    );
};

export default DoctorBrowseLayout;
