import React from "react";
import cl from "./.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import advancedFetch from "../../utils/advancedFetch";
import UserData from "../../data_types/UserData";
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

const RecordsLayout: React.FC = () => {
    const [userToReview, setUserToReview] = React.useState<UserData | null>(null);
    const [recordList, setRecordList] = React.useState<Array<RecordData> | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = React.useMemo(() => searchParams.get('id'), [searchParams]);

    const loadData = React.useCallback(async () => {
        try {
            let response: Response;

            response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/${userId}`, {
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
                setUserToReview(json);
            } else {
                return setErrorMessage(await response.text());
            }

            response = await advancedFetch(`http://${window.location.hostname}:7000/api/record/list/${userId}`, {
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
            } else {
                return setErrorMessage(await response.text());
            }
        } catch (error) {
            alert(error);
        }
    }, [userId]);

    React.useEffect(() => {
        loadData();
    }, [errorMessage, loadData]);

    React.useEffect(() => {
        if (currentUser?.role !== 'doctor') {
            navigate('/');
        }
    }, [currentUser?.role, navigate]);

    if (!errorMessage && (!currentUser || !userToReview || !recordList)) {
        return (
            <p>Loading...</p>
        );
    }

    if (errorMessage) {
        return (
            <div className={cl.records}>
                <h1 className={cl.records__header}>
                    {errorMessage}
                </h1>
            </div>
        );
    }

    return (
        <div className={cl.records}>
            <h1 className={cl.records__header}>
                Records
            </h1>
            <div className={cl.records__user_info}>
                <p className={cl.records__user_info__text}>
                    ID: {userToReview?.id}
                </p>
                <p className={cl.records__user_info__text}>
                    First name: {userToReview?.firstName}
                </p>
                <p className={cl.records__user_info__text}>
                    Last name: {userToReview?.lastName}
                </p>
            </div>
            <Link className={cl.records__add_record}
                to={`/edit-record?id=new&userId=${userToReview?.id ?? ''}`}>
                Add new record
            </Link>
            <div className={cl.records__list}>
                {recordList?.map((el, idx) => {
                    const canEdit = currentUser?.id === el.doctorId;

                    return (
                        <div className={cl.records__list__element} key={idx}>
                            {
                                canEdit ?
                                    <div className={cl.records__list__element__control}>
                                        <Link className={cl.records__list__element__control__edit}
                                            to={`/edit-record?id=${el.id}`}>
                                            Edit
                                        </Link>
                                    </div>
                                    : <></>
                            }
                            <p className={cl.records__list__element__type}>
                                {recordTypes[el.type]}
                            </p>
                            <h1 className={cl.records__list__element__header}>
                                {el.title}
                            </h1>
                            <p className={cl.records__list__element__diagnosis}>
                                {el.diagnosis}
                            </p>
                            <p className={cl.records__list__element__created_at}>
                                Created: {new Date(el.createdAt).toLocaleString()}
                            </p>
                            {
                                el.createdAt !== el.updatedAt ?
                                    <p className={cl.records__list__element__updated_at}>
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

export default RecordsLayout;
