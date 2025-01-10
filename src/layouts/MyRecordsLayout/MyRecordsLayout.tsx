import React from "react";
import cl from "./.module.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import advancedFetch from "../../utils/advancedFetch";
import RecordData from "../../data_types/RecordData";

const recordTypes: string[] = [
    '',
    'Diagnosis',
    'Treatment Plan',
    'Lab Results',
    'Prescription',
    'Progress Notes',
    'Referral',
    'Follow-Up Plan',
    'Immunization Record',
    'Allergy Information',
    'Consultation Note',
];

const MyRecordsLayout: React.FC = () => {
    const [recordList, setRecordList] = React.useState<Array<RecordData> | null>(null);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();

    const loadData = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/record/list`, {
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
                setRecordList(json);
            }
        } catch (error) {
            alert(error);
        }
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    React.useEffect(() => {
        if (currentUser?.role !== 'patient') {
            navigate('/');
        }
    }, [currentUser?.role, navigate]);

    if (!currentUser || !recordList) {
        return (
            <p>Loading...</p>
        );
    }

    return (
        <div className={cl.my_records}>
            <h1 className={cl.my_records__header}>
                Records
            </h1>
            <div className={cl.my_records__list}>
                {recordList?.map((el, idx) => {
                    return (
                        <div className={cl.my_records__list__element} key={idx}>
                            <p className={cl.my_records__list__element__type}>
                                {recordTypes[el.type]}
                            </p>
                            <h1 className={cl.my_records__list__element__header}>
                                {el.title}
                            </h1>
                            <p className={cl.my_records__list__element__diagnosis}>
                                {el.diagnosis}
                            </p>
                            <p className={cl.my_records__list__element__created_at}>
                                Created: {new Date(el.createdAt).toLocaleString()}
                            </p>
                            {
                                el.createdAt !== el.updatedAt ?
                                    <p className={cl.my_records__list__element__updated_at}>
                                        Updated: {new Date(el.updatedAt).toLocaleString()}
                                    </p>
                                    : <></>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyRecordsLayout;
