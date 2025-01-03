import React from "react";
import cl from "./.module.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";

const AdminLayout: React.FC = () => {
    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!['admin', 'doctor'].includes(currentUser?.role || '')) {
            navigate('/my-records');
        }
    }, [currentUser?.role, navigate]);

    return (
        <div className={cl.admin}>
            <nav className={cl.admin__navigation}>
                <NavLink
                    className={`${cl.admin__navigation__element} ${window.location.pathname === "/admin/users" ? cl.current : ''}`}
                    to="/admin/users">
                    Users
                </NavLink>
                <NavLink
                    className={`${cl.admin__navigation__element} ${window.location.pathname === "/admin/license-history" ? cl.current : ''}`}
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
