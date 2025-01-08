import React from "react";
import cl from "./.module.css";
import { Link, useNavigate } from "react-router-dom";
import advancedFetch from "../../utils/advancedFetch";
import { useAppSelector } from "../../redux/store";
import YesNoDialog from "../../components/YesNoDialog/YesNoDialog";

interface UserDataForDoctors {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    position?: string,
    hasDataAccess?: boolean
}

const UserAdminLayout: React.FC = () => {
    const [userList, setUserList] = React.useState<Array<UserDataForDoctors> | null>(null);
    const [userIdToDelete, setUserIdToDelete] = React.useState<number | null>(null);
    const [yesNoDialogIsOpened, setYesNoDialogIsOpened] = React.useState<boolean>(false);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();

    const loadUserList = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/list`, {
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
                setUserList(json);
            }
        } catch (error) {
            alert(error);
        }
    }, []);

    const deleteUserRequest = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/${userIdToDelete}`, {
                method: "DELETE",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                }
            });

            if (response.ok) {
                setUserList(prev => {
                    return [...prev ?? []].filter(el => el.id !== userIdToDelete);
                });
                setUserIdToDelete(null);
                setYesNoDialogIsOpened(false);
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(error);
        }
    }, [userIdToDelete]);

    const cancelUserDeleting = React.useCallback(() => {
        setUserIdToDelete(null);
        setYesNoDialogIsOpened(false);
    }, []);

    React.useEffect(() => {
        loadUserList();
    }, [loadUserList]);

    React.useEffect(() => {
        if (!['admin', 'doctor'].includes(currentUser?.role || '')) {
            navigate('/');
        }
    }, [currentUser?.role, navigate]);

    return (
        <div className={cl.user_admin}>
            <div className={cl.user_admin__control}>
                <Link className={cl.user_admin__control__register} to='/edit-user?id=new'>
                    Register user
                </Link>
            </div>
            <div className={cl.user_admin__list}>
                <div className={cl.user_admin__list__header}>
                    <div className={cl.user_admin__list__header__column}>
                        Email address
                    </div>
                    <div className={cl.user_admin__list__header__column}>
                        First name
                    </div>
                    <div className={cl.user_admin__list__header__column}>
                        Last name
                    </div>
                    <div className={cl.user_admin__list__header__column}>
                        Role
                    </div>
                    <div className={cl.user_admin__list__header__column}>
                        Position
                    </div>
                    <div className={cl.user_admin__list__header__column}>
                        Actions
                    </div>
                </div>
                {userList?.map((el, idx) => {
                    return (
                        <div className={cl.user_admin__list__element} key={idx}>
                            <div className={cl.user_admin__list__element__text_field}>
                                {el.email}
                            </div>
                            <div className={cl.user_admin__list__element__text_field}>
                                {el.firstName}
                            </div>
                            <div className={cl.user_admin__list__element__text_field}>
                                {el.lastName}
                            </div>
                            <div className={cl.user_admin__list__element__text_field}>
                                {el.role}
                            </div>
                            <div className={cl.user_admin__list__element__text_field}>
                                {el.position || '-'}
                            </div>
                            <div className={cl.user_admin__list__element__actions}>
                                {
                                    currentUser?.role === 'admin' || (currentUser?.role === 'doctor' && currentUser?.id !== el.id) ?
                                        <Link className={cl.user_admin__list__element__actions__edit} to={`/edit-user?id=${el.id}`}>
                                            Edit
                                        </Link>
                                        : <></>
                                }
                                {
                                    currentUser?.role === 'doctor' && el.hasDataAccess && currentUser?.id !== el.id ?
                                        <Link className={cl.user_admin__list__element__actions__records} to={`/records?id=${el.id}`}>
                                            Records
                                        </Link>
                                        : <></>
                                }
                                {
                                    currentUser?.role === 'admin' && currentUser?.id !== el.id ?
                                        <button className={cl.user_admin__list__element__actions__delete}
                                            onClick={() => {
                                                setUserIdToDelete(el.id);
                                                setYesNoDialogIsOpened(true);
                                            }}>
                                            Delete
                                        </button>
                                        : <></>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
            <YesNoDialog
                dialogState={yesNoDialogIsOpened}
                title='Delete a user'
                description='Are you sure you want to delete the user account?'
                onYesButtonClick={deleteUserRequest}
                onNoButtonClick={cancelUserDeleting} />
        </div>
    );
};

export default UserAdminLayout;
