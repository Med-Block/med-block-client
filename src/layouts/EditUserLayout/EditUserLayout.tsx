import React from "react";
import cl from "./.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import advancedFetch from "../../utils/advancedFetch";
import UserData from "../../data_types/UserData";

const EditUserLayout: React.FC = () => {
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [userToEdit, setUserToEdit] = React.useState<UserData | null | undefined>(null);
    const [isUserFound, setIsUserFound] = React.useState<boolean>(false);
    const [roleValue, setRoleValue] = React.useState<string>('user');

    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const firstNameInputRef = React.useRef<HTMLInputElement>(null);
    const lastNameInputRef = React.useRef<HTMLInputElement>(null);
    const positionInputRef = React.useRef<HTMLInputElement>(null);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = React.useMemo(() => searchParams.get('id'), [searchParams]);

    const loadUserData = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/${userId}`, {
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
                setUserToEdit(json);
                setIsUserFound(true);
                setRoleValue(json.role);
            } else {
                setUserToEdit(undefined);
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }
    }, [userId]);

    async function registerUserRequest() {
        setIsSaving(true);

        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/auth/register`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                },
                body: JSON.stringify({
                    email: emailInputRef.current?.value,
                    firstName: firstNameInputRef.current?.value,
                    lastName: lastNameInputRef.current?.value,
                    role: roleValue,
                    position: positionInputRef.current?.value || undefined
                })
            });

            if (response.ok) {
                navigate('/admin/users');
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }

        setIsSaving(false);
    }

    async function updateUserRequest() {
        setIsSaving(true);

        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/${userId}`, {
                method: "PUT",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                },
                body: JSON.stringify({
                    firstName: firstNameInputRef.current?.value,
                    lastName: lastNameInputRef.current?.value,
                    role: roleValue,
                    position: positionInputRef.current?.value || undefined
                })
            });

            if (response.ok) {
                alert('User info is saved');
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }

        setIsSaving(false);
    }

    React.useEffect(() => {
        if (userId !== 'new') {
            loadUserData();
        } else {
            setUserToEdit(undefined);
            setIsUserFound(true);
        }
    }, [loadUserData, userId]);

    React.useEffect(() => {
        if (!['admin', 'doctor'].includes(currentUser?.role || '')) {
            navigate('/my-records');
        }
    }, [currentUser?.role, navigate]);

    if (!currentUser || userToEdit === null) {
        return (
            <p>Loading...</p>
        );
    }

    if (!isUserFound) {
        return (
            <div className={cl.edit_user}>
                <h1 className={cl.edit_user__header}>
                    User not found
                </h1>
            </div>
        );
    }

    return (
        <div className={cl.edit_user}>
            <h1 className={cl.edit_user__header}>
                {userId === 'new' ? 'Register new user' : 'Edit user'}
            </h1>
            <div className={cl.edit_user__data}>
                <div className={cl.edit_user__data__field}>
                    <label className={cl.edit_user__data__field__label}>
                        Email address
                    </label>
                    <input
                        className={cl.edit_user__data__field__input}
                        type="email"
                        defaultValue={userToEdit?.email}
                        placeholder="Email address"
                        maxLength={50}
                        disabled={userId !== 'new'}
                        ref={emailInputRef} />
                </div>
                <div className={cl.edit_user__data__field}>
                    <label className={cl.edit_user__data__field__label}>
                        First name
                    </label>
                    <input
                        className={cl.edit_user__data__field__input}
                        type="text"
                        defaultValue={userToEdit?.firstName}
                        placeholder="First name"
                        maxLength={50}
                        ref={firstNameInputRef} />
                </div>
                <div className={cl.edit_user__data__field}>
                    <label className={cl.edit_user__data__field__label}>
                        Last name
                    </label>
                    <input
                        className={cl.edit_user__data__field__input}
                        type="text"
                        defaultValue={userToEdit?.lastName}
                        placeholder="Last name"
                        maxLength={50}
                        ref={lastNameInputRef} />
                </div>
                {
                    currentUser.id !== userToEdit?.id && currentUser.role === 'admin' ?
                        <div className={cl.edit_user__data__field}>
                            <label className={cl.edit_user__data__field__label}>
                                Role
                            </label>
                            <select
                                className={cl.edit_user__data__field__select}
                                value={roleValue}
                                title="role"
                                disabled={currentUser?.role !== 'admin'}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRoleValue(e.target.value)}>
                                <option className={cl.edit_user__data__select__option} value='user'>
                                    User
                                </option>
                                <option className={cl.edit_user__data__select__option} value='doctor'>
                                    Doctor
                                </option>
                                <option className={cl.edit_user__data__select__option} value='admin'>
                                    Admin
                                </option>
                            </select>
                        </div>
                        : <></>
                }
                {
                    currentUser?.role === 'admin' && currentUser.id !== userToEdit?.id && roleValue === 'doctor' ?
                        <div className={cl.edit_user__data__field}>
                            <label className={cl.edit_user__data__field__label}>
                                Position
                            </label>
                            <input
                                className={cl.edit_user__data__field__input}
                                type="text"
                                defaultValue={userToEdit?.position}
                                placeholder="Position"
                                maxLength={50}
                                ref={positionInputRef} />
                        </div>
                        : <></>
                }
            </div>
            <div className={cl.edit_user__control}>
                <button
                    className={cl.edit_user__control__save}
                    disabled={isSaving}
                    onClick={userId === 'new' ? registerUserRequest : updateUserRequest}>
                    Save
                </button>
                <Link className={cl.edit_user__control__to_list} to='/admin/users'>
                    Go to the list
                </Link>
            </div>
        </div>
    );
};

export default EditUserLayout;
