import React from "react";
import cl from "./.module.css";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const AdminLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className={cl.admin}>
            <nav className={cl.admin__navigation}>
                <NavLink
                    className={`${cl.admin__navigation__element} ${location.pathname === "/admin/users" ? cl.current : ''}`}
                    to="/admin/users">
                    Users
                </NavLink>
                <NavLink
                    className={`${cl.admin__navigation__element} ${location.pathname === "/admin/license-history" ? cl.current : ''}`}
                    to="/admin/license-history">
                    License history
                </NavLink>
            </nav>
            <div className={cl.admin__content}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
