import React from "react";
import cl from "./.module.css";
import { useNavigate } from "react-router-dom";
import advancedFetch from "../../utils/advancedFetch";
import { useAppSelector } from "../../redux/store";
import UserData from "../../data_types/UserData";

type LicenseLogData = {
    id: number,
    licenseId: number,
    event: string,
    createdAt: string,
    user: UserData,
    doctor: UserData
}

const AdminLicenseHistoryLayout: React.FC = () => {
    const [logList, setLogList] = React.useState<Array<LicenseLogData> | null>(null);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();

    const loadLogList = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/license/logs`, {
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
                setLogList(json);
            }
        } catch (error) {
            alert(error);
        }
    }, []);

    React.useEffect(() => {
        if (currentUser?.role !== 'admin') {
            navigate('/');
        }
    }, [currentUser?.role, navigate]);

    React.useEffect(() => {
        loadLogList();
    }, [loadLogList]);

    return (
        <div className={cl.license_history}>
            <div className={cl.license_history__list}>
                <div className={cl.license_history__list__header}>
                    <div className={cl.license_history__list__header__column}>
                        Patient
                    </div>
                    <div className={cl.license_history__list__header__column}>
                        Doctor
                    </div>
                    <div className={cl.license_history__list__header__column}>
                        Timestamp
                    </div>
                    <div className={cl.license_history__list__header__column}>
                        Event type
                    </div>
                </div>
                {logList?.map((el, idx) => {
                    return (
                        <div className={cl.license_history__list__element} key={idx}>
                            <div className={cl.license_history__list__element__text_field}>
                                <p>
                                    {el.user.firstName}
                                </p>
                                <br />
                                <p>
                                    {el.user.lastName}
                                </p>
                            </div>
                            <div className={cl.license_history__list__element__text_field}>
                                <p>
                                    {el.doctor.firstName}
                                </p>
                                <br />
                                <p>
                                    {el.doctor.lastName}
                                </p>
                            </div>
                            <div className={cl.license_history__list__element__text_field}>
                                {new Date(el.createdAt).toLocaleString()}
                            </div>
                            <div className={cl.license_history__list__element__text_field}>
                                <p className={`${cl.license_history__list__element__text_field__event} ${cl[el.event.toLowerCase()]}`}>
                                    {el.event}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminLicenseHistoryLayout;
