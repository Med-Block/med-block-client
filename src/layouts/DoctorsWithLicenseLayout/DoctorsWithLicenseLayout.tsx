import React from "react";
import cl from "./.module.css";
import { useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import UserData from "../../data_types/UserData";
import advancedFetch from "../../utils/advancedFetch";
import YesNoDialog from "../../components/YesNoDialog/YesNoDialog";

const DoctorsWithLicenseLayout: React.FC = () => {
    const [doctorList, setDoctorList] = React.useState<Array<UserData> | null>(null);
    const [licenseToDeactivate, setLicenseToDeactivate] = React.useState<number | null>(null);
    const [yesNoDialogIsOpened, setYesNoDialogIsOpened] = React.useState<boolean>(false);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();

    const loadDoctorList = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/license/doctors`, {
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
                    doctorId: licenseToDeactivate
                })
            });

            if (response.ok) {
                setDoctorList(prev => {
                    return [...prev ?? []].filter(el => el.id !== licenseToDeactivate);
                });
                setLicenseToDeactivate(null);
                setYesNoDialogIsOpened(false);
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(error);
        }
    }, [licenseToDeactivate]);

    const cancelLicenseDeactivating = React.useCallback(() => {
            setLicenseToDeactivate(null);
            setYesNoDialogIsOpened(false);
        }, []);

    React.useEffect(() => {
        if (currentUser?.role !== 'user') {
            navigate('/');
        }
    }, [currentUser?.role, navigate]);

    React.useEffect(() => {
        loadDoctorList();
    }, [loadDoctorList]);

    return (
        <div className={cl.doctors_with_license}>
            <div className={cl.doctors_with_license__list}>
                <div className={cl.doctors_with_license__list__header}>
                    <div className={cl.doctors_with_license__list__header__column}>
                        Email address
                    </div>
                    <div className={cl.doctors_with_license__list__header__column}>
                        First name
                    </div>
                    <div className={cl.doctors_with_license__list__header__column}>
                        Last name
                    </div>
                    <div className={cl.doctors_with_license__list__header__column}>
                        Position
                    </div>
                    <div className={cl.doctors_with_license__list__header__column}>
                        Records access
                    </div>
                </div>
                {doctorList?.map((el, idx) => {
                    return (
                        <div className={cl.doctors_with_license__list__element} key={idx}>
                            <div className={cl.doctors_with_license__list__element__text_field}>
                                {el.email}
                            </div>
                            <div className={cl.doctors_with_license__list__element__text_field}>
                                {el.firstName}
                            </div>
                            <div className={cl.doctors_with_license__list__element__text_field}>
                                {el.lastName}
                            </div>
                            <div className={cl.doctors_with_license__list__element__text_field}>
                                {el.position}
                            </div>
                            <div className={cl.doctors_with_license__list__element__actions}>
                                <button className={cl.doctors_with_license__list__element__actions__disable}
                                    onClick={() => {
                                        setLicenseToDeactivate(el.id);
                                        setYesNoDialogIsOpened(true);
                                    }}>
                                    Disable
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <YesNoDialog
                dialogState={yesNoDialogIsOpened}
                title='Disable records access'
                description='Are you sure you want to execute the action?'
                onYesButtonClick={deactivateLicenseRequest}
                onNoButtonClick={cancelLicenseDeactivating} />
        </div>
    );
};

export default DoctorsWithLicenseLayout;
