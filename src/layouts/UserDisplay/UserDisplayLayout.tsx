import React from "react";
import cl from "./.module.css";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import advancedFetch from "../../utils/advancedFetch";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setCurrentUser } from "../../redux/slices/userSlice";

const UserDisplayLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();

    const loadUserData = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/self`, {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                }
            });

            if (response.ok) {
                const json = await response.json();
                dispatch(setCurrentUser({
                    id: json.id,
                    email: json.email,
                    firstName: json.firstName,
                    lastName: json.lastName,
                    role: json.role,
                    position: json.position ?? undefined
                }));
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }
    }, [dispatch]);

    React.useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    if (!currentUser) {
        return (
            <p>Loading...</p>
        );
    }

    return (
        <div className={cl.user_display}>
            <header className={cl.user_display__top}>
                <div className={cl.user_display__top__section_1}>
                    <Link className={cl.user_display__top__section_1__logo} to='/'>
                        MedBlock
                    </Link>
                </div>
                <div className={cl.user_display__top__section_2}>
                    <div className={cl.user_display__top__section_2__user_info}>
                        <p className={cl.user_display__top__section_2__user_info__value}>
                            {currentUser.firstName}
                        </p>
                        <p className={cl.user_display__top__section_2__user_info__value}>
                            {currentUser.lastName}
                        </p>
                    </div>
                    <div className={cl.user_display__top__section_2__options}>
                        <button className={cl.user_display__top__section_2__options__log_out}
                            onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/log-in', { replace: true });
                            }}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>
            <main className={cl.user_display__bottom}>
                <nav className={cl.user_display__bottom__navigation}>
                    <NavLink className={cl.user_display__bottom__navigation__element} to="/my-records">
                        <svg className={cl.user_display__bottom__navigation__element__img}
                            fill="#ffffff" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                            <path d="M208,32H48A16.01833,16.01833,0,0,0,32,48V208a16.01833,16.01833,0,0,0,16,16H208a16.01833,16.01833,0,0,0,
                            16-16V48A16.01833,16.01833,0,0,0,208,32ZM80,208H48V48H80Zm96-56H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,
                            16Zm0-32H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z" />
                        </svg>
                    </NavLink>
                    <NavLink className={cl.user_display__bottom__navigation__element} to="/settings">
                        <svg className={cl.user_display__bottom__navigation__element__img}
                            fill="#ffffff" width="800px" height="800px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 7h-.76a1 1 0 0 1-.7-1.71l.53-.53a1.008 1.008 0 0 0 0-1.42l-1.41-1.41a1.008 1.008 0 0 0-1.42 0l-.51.51a.974.974
                            0 0 1-.73.32 1 1 0 0 1-1-1V1a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v.76a1 1 0 0 1-1 1 .974.974 0 0 1-.73-.32l-.51-.51a1.008 1.008 0
                            0 0-1.42 0L1.93 3.34a1.008 1.008 0 0 0 0 1.42c.19.19.4.37.58.57a.92.92 0 0 1 .25.67 1 1 0 0 1-1 1H1a1 1 0 0 0-1 1v2a1 1 0
                            0 0 1 1h.76a1 1 0 0 1 1 1 .92.92 0 0 1-.25.67c-.18.2-.39.38-.58.57a1.008 1.008 0 0 0 0 1.42l1.41 1.41a1.008 1.008 0 0 0 1.42
                            0l.51-.51a.974.974 0 0 1 .73-.32 1 1 0 0 1 1 1V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.76a1 1 0 0 1 1-1 .974.974 0 0 1
                            .73.32l.51.51a1.008 1.008 0 0 0 1.42 0l1.41-1.41a1.008 1.008 0 0 0 0-1.42l-.53-.53a1 1 0 0 1 .7-1.71H17a1 1 0 0 0 1-1V8a1 1
                            0 0 0-1-1zm-8 5a3 3 0 1 1 3-3 3 3 0 0 1-3 3z" fillRule="evenodd" />
                        </svg>
                    </NavLink>
                    {
                        ['admin', 'doctor'].includes(currentUser.role || '') ?
                            <NavLink className={cl.user_display__bottom__navigation__element} to="/admin/users">
                                <svg className={cl.user_display__bottom__navigation__element__img}
                                    fill="#ffffff" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M983.727 5.421 1723.04 353.62c19.765 9.374 32.414 29.252 32.414 51.162v601.525c0 489.6-424.207 719.774-733.779
                                    887.943l-34.899 18.975c-8.47 4.517-17.731 6.889-27.105 6.889-9.262 0-18.523-2.372-26.993-6.89l-34.9-18.974C588.095
                                    1726.08 164 1495.906 164 1006.306V404.78c0-21.91 12.65-41.788 32.414-51.162L935.727 5.42c15.134-7.228 32.866-7.228 48
                                    0ZM757.088 383.322c-176.075 0-319.285 143.323-319.285 319.398 0 176.075 143.21 319.285 319.285 319.285 1.92 0 3.84 0
                                    5.76-.113l58.504 58.503h83.689v116.781h116.781v83.803l91.595 91.482h313.412V1059.05l-350.57-350.682c.114-1.807.114-3.727.114-5.647
                                    0-176.075-143.21-319.398-319.285-319.398Zm0 112.942c113.732 0 206.344 92.724 205.327 216.62l-3.953 37.271 355.426
                                    355.652v153.713h-153.713l-25.412-25.299v-149.986h-116.78v-116.78H868.108l-63.812-63.7-47.209 5.309c-113.732
                                    0-206.344-92.5-206.344-206.344 0-113.732 92.612-206.456 206.344-206.456Zm4.98 124.98c-46.757 0-84.705 37.948-84.705
                                    84.706s37.948 84.706 84.706 84.706c46.757 0 84.706-37.948 84.706-84.706s-37.949-84.706-84.706-84.706Z" fillRule="evenodd" />
                                </svg>
                            </NavLink>
                            : <></>
                    }
                </nav>
                <div className={cl.user_display__bottom__content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default UserDisplayLayout;
