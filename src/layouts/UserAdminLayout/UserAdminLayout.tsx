import React from "react";
import cl from "./.module.css";
import UserData from "../../data_types/UserData";
import { Link } from "react-router-dom";
import advancedFetch from "../../utils/advancedFetch";
import { useAppSelector } from "../../redux/store";
import YesNoDialog from "../../components/YesNoDialog/YesNoDialog";

const UserAdminLayout: React.FC = () => {
    const [userList, setUserList] = React.useState<Array<UserData> | null>(null);
    const [userIdToDelete, setUserIdToDelete] = React.useState<number | null>(null);
    const [yesNoDialogIsOpened, setYesNoDialogIsOpened] = React.useState<boolean>(false);

    const currentUser = useAppSelector((state) => state.user.currentUser);

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
            alert(`Error while checking authorization: ${error}`);
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
            alert(`Error while checking authorization: ${error}`);
        }
    }, [userIdToDelete]);

    const cancelUserDeleting = React.useCallback(() => {
        setUserIdToDelete(null);
        setYesNoDialogIsOpened(false);
    }, []);

    React.useEffect(() => {
        loadUserList();
    }, [loadUserList]);

    return (
        <div className={cl.user_admin}>
            <div className={cl.user_admin__control}>
                <Link className={cl.user_admin__control__register} to='/edit-user?id=new'>
                    Register user
                </Link>
            </div>
            <div className={cl.user_admin__list}>
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
                                    currentUser?.role === 'admin' || (currentUser?.role === 'doctor' && el.role === 'user' && currentUser?.id !== el.id) ?
                                        <Link className={cl.user_admin__list__element__actions__edit} to={`/edit-user?id=${el.id}`}>
                                            Edit
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
