import React from "react";
import cl from "./.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import advancedFetch from "../../utils/advancedFetch";
import RecordData from "../../data_types/RecordData";

const EditRecordLayout: React.FC = () => {
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [recordToEdit, setRecordToEdit] = React.useState<RecordData | null | undefined>(null);
    const [typeValue, setTypeValue] = React.useState<number>(1);

    const userIdInputRef = React.useRef<HTMLInputElement>(null);
    const titleInputRef = React.useRef<HTMLInputElement>(null);
    const diagnosisInputRef = React.useRef<HTMLTextAreaElement>(null);

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const recordId = React.useMemo(() => searchParams.get('id'), [searchParams]);
    const userId = React.useMemo(() => searchParams.get('userId'), [searchParams]);

    const loadRecordData = React.useCallback(async () => {
        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/record/${recordId}`, {
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
                setRecordToEdit(json);
                setTypeValue(parseInt(json.type));
            } else {
                setErrorMessage(await response.text());
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }
    }, [recordId]);

    async function addRecordRequest() {
        setIsSaving(true);

        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/record`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                },
                body: JSON.stringify({
                    userId: parseInt(userIdInputRef.current?.value || '0'),
                    title: titleInputRef.current?.value,
                    description: diagnosisInputRef.current?.value,
                    type: typeValue
                })
            });

            if (response.ok) {
                navigate(-1);
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }

        setIsSaving(false);
    }

    async function updateRecordRequest() {
        setIsSaving(true);

        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/record/${recordId}`, {
                method: "PUT",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                },
                body: JSON.stringify({
                    title: titleInputRef.current?.value,
                    description: diagnosisInputRef.current?.value,
                    type: typeValue
                })
            });

            if (response.ok) {
                navigate(-1);
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }

        setIsSaving(false);
    }

    React.useEffect(() => {
        if (recordId !== 'new') {
            loadRecordData();
        } else {
            setRecordToEdit(undefined);
        }
    }, [loadRecordData, recordId]);

    React.useEffect(() => {
        if (!['admin', 'doctor'].includes(currentUser?.role || '')) {
            navigate('/');
        }
    }, [currentUser?.role, navigate]);

    if (!errorMessage && (!currentUser || recordToEdit === null)) {
        return (
            <p>Loading...</p>
        );
    }

    if (errorMessage) {
        return (
            <div className={cl.edit_record}>
                <h1 className={cl.edit_record__header}>
                    {errorMessage}
                </h1>
            </div>
        );
    }

    return (
        <div className={cl.edit_record}>
            <h1 className={cl.edit_record__header}>
                {recordId === 'new' ? 'Add record' : 'Edit record'}
            </h1>
            <div className={cl.edit_record__data}>
                {
                    recordId === 'new' ?
                        <div className={cl.edit_record__data__field}>
                            <label className={cl.edit_record__data__field__label}>
                                Patient ID
                            </label>
                            <input
                                className={cl.edit_record__data__field__input}
                                type="number"
                                placeholder="Patient ID"
                                defaultValue={userId ?? undefined}
                                disabled={recordId !== 'new'}
                                ref={userIdInputRef} />
                        </div>
                        : <></>
                }
                <div className={cl.edit_record__data__field}>
                    <label className={cl.edit_record__data__field__label}>
                        Title
                    </label>
                    <input
                        className={cl.edit_record__data__field__input}
                        type="text"
                        defaultValue={recordToEdit?.title}
                        placeholder="Title"
                        maxLength={100}
                        ref={titleInputRef} />
                </div>
                <div className={cl.edit_record__data__field}>
                    <label className={cl.edit_record__data__field__label}>
                        Diagnosis
                    </label>
                    <textarea
                        className={cl.edit_record__data__field__textarea}
                        defaultValue={recordToEdit?.diagnosis}
                        placeholder="Diagnosis"
                        maxLength={8000}
                        ref={diagnosisInputRef}></textarea>
                </div>
                <div className={cl.edit_record__data__field}>
                    <label className={cl.edit_record__data__field__label}>
                        Type
                    </label>
                    <select
                        className={cl.edit_record__data__field__select}
                        value={typeValue}
                        title="type"
                        defaultValue={recordToEdit?.type || '1'}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeValue(parseInt(e.target.value))}>
                        <option className={cl.edit_record__data__select__option} value='1'>
                            Diagnosis
                        </option>
                        <option className={cl.edit_record__data__select__option} value='2'>
                            Treatment Plan
                        </option>
                        <option className={cl.edit_record__data__select__option} value='3'>
                            Lab Results
                        </option>
                        <option className={cl.edit_record__data__select__option} value='4'>
                            Prescription
                        </option>
                        <option className={cl.edit_record__data__select__option} value='5'>
                            Progress Notes
                        </option>
                        <option className={cl.edit_record__data__select__option} value='6'>
                            Referral
                        </option>
                        <option className={cl.edit_record__data__select__option} value='7'>
                            Follow-Up Plan
                        </option>
                        <option className={cl.edit_record__data__select__option} value='8'>
                            Immunization Record
                        </option>
                        <option className={cl.edit_record__data__select__option} value='9'>
                            Allergy Information
                        </option>
                        <option className={cl.edit_record__data__select__option} value='10'>
                            Consultation Note
                        </option>
                    </select>
                </div>
            </div>
            <div className={cl.edit_record__control}>
                <button
                    className={cl.edit_record__control__save}
                    disabled={isSaving}
                    onClick={recordId === 'new' ? addRecordRequest : updateRecordRequest}>
                    Save
                </button>
                <button className={cl.edit_record__control__to_list}
                    onClick={() => navigate(-1)}>
                    Go back
                </button>
            </div>
        </div>
    );
};

export default EditRecordLayout;
