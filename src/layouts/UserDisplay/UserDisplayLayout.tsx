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
                            <path fillRule="evenodd" d="M208,32H48A16.01833,16.01833,0,0,0,32,48V208a16.01833,16.01833,0,0,0,16,16H208a16.01833,16.01833,0,0,0,
                            16-16V48A16.01833,16.01833,0,0,0,208,32ZM80,208H48V48H80Zm96-56H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,
                            16Zm0-32H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z" />
                        </svg>
                    </NavLink>
                    {
                        currentUser.role === 'user' ?
                            <NavLink className={cl.user_display__bottom__navigation__element} to="/doctors/with-license">
                                <svg className={cl.user_display__bottom__navigation__element__img}
                                    fill="#ffffff" width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M24 25.1333C28.9725 25.1333 33 21.076 33 16.0667C33 11.0573 28.9725 7 24 7C19.0275
                            7 15 11.0573 15 16.0667C15 21.076 19.0275 25.1333 24 25.1333Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.1254 28.9539C17.8971 28.4861 17.3814 28.2333 16.8786
                            28.3569C11.4745 29.6849 6 32.3928 6 36.4664V42.9997H42V36.4664C42 32.3928 36.5255 29.6849 31.1214 28.3569C30.6186
                            28.2333 30.1029 28.4861 29.8746 28.9539L25.8105 31.9539C24.9218 31.9541 24.4693 31.9541 24.0248 31.954C23.5637
                            31.954 23.1112 31.954 22.1893 31.9542L18.1254 28.9539ZM31 31H33V34H36V36H33V39H31V36H28V34H31V31Z" />
                                </svg>
                            </NavLink>
                            : <></>
                    }
                    <NavLink className={cl.user_display__bottom__navigation__element} to="/settings">
                        <svg className={cl.user_display__bottom__navigation__element__img}
                            width="800px" height="800px" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915
                            2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635
                            4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318
                            5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339
                            6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506
                            10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977
                            13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894
                            3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778
                            18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635
                            19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561
                            22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815
                            15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186
                            18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261
                            16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243
                            21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022
                            10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055
                            21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722
                            5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136
                            4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15
                            15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15
                            12.5 15Z" />
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
