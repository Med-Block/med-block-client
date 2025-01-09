import React from "react";
import cl from "./.module.css";
import advancedFetch from "../../utils/advancedFetch";
import { useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import YesNoDialog from "../../components/YesNoDialog/YesNoDialog";

interface DoctorData {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    position: string,
    hasDataAccess: boolean
}

const AllDoctorsLayout: React.FC = () => {
    const [doctorList, setDoctorList] = React.useState<Array<DoctorData> | null>(null);
    const [recordsAccessToConfirm, setRecordsAccessToConfirm] = React.useState<{ enable: boolean, doctorId: number } | null>(null);
    const [yesNoDialogIsOpened, setYesNoDialogIsOpened] = React.useState<boolean>(false);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();

    const loadDoctorList = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/doctor`, {
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
                setDoctorList(json);
            }
        } catch (error) {
            alert(error);
        }
    }, []);

    const activateLicenseRequest = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/license/activate`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                },
                body: JSON.stringify({
                    doctorId: recordsAccessToConfirm?.doctorId
                })
            });

            if (response.ok) {
                setDoctorList(prev => {
                    return [...prev ?? []].map(el => {
                        return { ...el, hasDataAccess: el.id === recordsAccessToConfirm?.doctorId ? true : el.hasDataAccess };
                    });
                });
                setRecordsAccessToConfirm(null);
                setYesNoDialogIsOpened(false);
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(`Error: ${error}`);
        }
    }, [recordsAccessToConfirm?.doctorId]);

    const deactivateLicenseRequest = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/license/deactivate`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                },
                body: JSON.stringify({
                    doctorId: recordsAccessToConfirm?.doctorId
                })
            });

            if (response.ok) {
                setDoctorList(prev => {
                    return [...prev ?? []].map(el => {
                        return { ...el, hasDataAccess: el.id === recordsAccessToConfirm?.doctorId ? false : el.hasDataAccess };
                    });
                });
                setRecordsAccessToConfirm(null);
                setYesNoDialogIsOpened(false);
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(error);
        }
    }, [recordsAccessToConfirm?.doctorId]);

    const cancelRecordsAccessAction = React.useCallback(() => {
            setRecordsAccessToConfirm(null);
            setYesNoDialogIsOpened(false);
        }, []);

    React.useEffect(() => {
        if (currentUser?.role !== 'patient') {
            navigate('/');
        }
    }, [currentUser?.role, navigate]);

    React.useEffect(() => {
        loadDoctorList();
    }, [loadDoctorList]);

    return (
        <div className={cl.all_doctors}>
            <div className={cl.all_doctors__list}>
                <div className={cl.all_doctors__list__header}>
                    <div className={cl.all_doctors__list__header__column}>
                        Email address
                    </div>
                    <div className={cl.all_doctors__list__header__column}>
                        First name
                    </div>
                    <div className={cl.all_doctors__list__header__column}>
                        Last name
                    </div>
                    <div className={cl.all_doctors__list__header__column}>
                        Position
                    </div>
                    <div className={cl.all_doctors__list__header__column}>
                        Records access
                    </div>
                </div>
                {doctorList?.map((el, idx) => {
                    return (
                        <div className={cl.all_doctors__list__element} key={idx}>
                            <div className={cl.all_doctors__list__element__text_field}>
                                {el.email}
                            </div>
                            <div className={cl.all_doctors__list__element__text_field}>
                                {el.firstName}
                            </div>
                            <div className={cl.all_doctors__list__element__text_field}>
                                {el.lastName}
                            </div>
                            <div className={cl.all_doctors__list__element__text_field}>
                                {el.position}
                            </div>
                            <div className={cl.all_doctors__list__element__actions}>
                                <button className={`${cl.all_doctors__list__element__actions__record_access} ${el.hasDataAccess ? cl.disable : ''}`}
                                    onClick={() => {
                                        setRecordsAccessToConfirm({ enable: !el.hasDataAccess, doctorId: el.id });
                                        setYesNoDialogIsOpened(true);
                                    }}>
                                    {el.hasDataAccess ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <YesNoDialog
                dialogState={yesNoDialogIsOpened}
                title={`${recordsAccessToConfirm?.enable ? 'Enable' : 'Disable'} records access`}
                description='Are you sure you want to execute the action?'
                onYesButtonClick={recordsAccessToConfirm?.enable ? activateLicenseRequest : deactivateLicenseRequest}
                onNoButtonClick={cancelRecordsAccessAction} />
        </div>
    );
};

export default AllDoctorsLayout;
