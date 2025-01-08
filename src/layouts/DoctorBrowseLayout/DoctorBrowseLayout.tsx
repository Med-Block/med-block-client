import React from "react";
import cl from "./.module.css";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const DoctorBrowseLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className={cl.doctor_browse}>
            <nav className={cl.doctor_browse__navigation}>
                <NavLink
                    className={`${cl.doctor_browse__navigation__element} ${location.pathname === "/doctors/with-license" ? cl.current : ''}`}
                    to="/doctors/with-license">
                    Doctors with license
                </NavLink>
                <NavLink
                    className={`${cl.doctor_browse__navigation__element} ${location.pathname === "/doctors/all" ? cl.current : ''}`}
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
