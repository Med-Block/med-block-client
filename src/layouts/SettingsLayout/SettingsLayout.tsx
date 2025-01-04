import React from "react";
import cl from "./.module.css";
import { useAppSelector } from "../../redux/store";
import advancedFetch from "../../utils/advancedFetch";

const SettingsLayout: React.FC = () => {
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const firstNameInputRef = React.useRef<HTMLInputElement>(null);
    const lastNameInputRef = React.useRef<HTMLInputElement>(null);

    const currentPasswordInputRef = React.useRef<HTMLInputElement>(null);
    const newPasswordInputRef = React.useRef<HTMLInputElement>(null);
    const passwordConfirmInputRef = React.useRef<HTMLInputElement>(null);

    const currentUser = useAppSelector((state) => state.user.currentUser);

    async function updateBasicDataRequest() {
        setIsSaving(true);

        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/self`, {
                method: "PUT",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                },
                body: JSON.stringify({
                    email: emailInputRef.current?.value,
                    firstName: firstNameInputRef.current?.value || undefined,
                    lastName: lastNameInputRef.current?.value || undefined
                })
            });

            if (response.ok) {
                alert('Changes are saved');
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }

        setIsSaving(false);
    }

    async function changePasswordRequest() {
        if (newPasswordInputRef.current?.value !== passwordConfirmInputRef.current?.value) {
            return alert('New password is not confirmed');
        }

        setIsSaving(true);

        try {
            const response = await advancedFetch(`http://${window.location.hostname}:7000/api/user/self/update-password`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token') ?
                        `Bearer ${localStorage.getItem('token')}` : ""
                },
                body: JSON.stringify({
                    currentPassword: currentPasswordInputRef.current?.value,
                    newPassword: newPasswordInputRef.current?.value
                })
            });

            if (response.ok) {
                alert('Password is changed');
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert(`Error while checking authorization: ${error}`);
        }

        setIsSaving(false);
    }

    return (
        <div className={cl.settings}>
            <h1 className={cl.settings__header}>
                Settings
            </h1>
            <div className={cl.settings__data}>
                <h2 className={cl.settings__data__subheader}>
                    Basic data
                </h2>
                <div className={cl.settings__data__field}>
                    <label className={cl.settings__data__field__label}>
                        Email address
                    </label>
                    <input
                        className={cl.settings__data__field__input}
                        type="email"
                        defaultValue={currentUser?.email}
                        placeholder="Email address"
                        maxLength={50}
                        ref={emailInputRef} />
                </div>
                {
                    currentUser?.role === 'admin' ?
                        <>
                            <div className={cl.settings__data__field}>
                                <label className={cl.settings__data__field__label}>
                                    First name
                                </label>
                                <input
                                    className={cl.settings__data__field__input}
                                    type="text"
                                    defaultValue={currentUser?.firstName}
                                    placeholder="First name"
                                    maxLength={50}
                                    ref={firstNameInputRef} />
                            </div>
                            <div className={cl.settings__data__field}>
                                <label className={cl.settings__data__field__label}>
                                    Last name
                                </label>
                                <input
                                    className={cl.settings__data__field__input}
                                    type="text"
                                    defaultValue={currentUser?.lastName}
                                    placeholder="Last name"
                                    maxLength={50}
                                    ref={lastNameInputRef} />
                            </div>
                        </> : <></>
                }
                <div className={cl.settings__data__control}>
                    <button
                        className={cl.settings__data__control__apply}
                        disabled={isSaving}
                        onClick={updateBasicDataRequest}>
                        Save
                    </button>
                </div>
            </div>
            <div className={cl.settings__data}>
                <h2 className={cl.settings__data__subheader}>
                    Change password
                </h2>
                <div className={cl.settings__data__field}>
                    <label className={cl.settings__data__field__label}>
                        Current password
                    </label>
                    <input
                        className={cl.settings__data__field__input}
                        type="password"
                        placeholder="Current password"
                        ref={currentPasswordInputRef} />
                </div>
                <div className={cl.settings__data__field}>
                    <label className={cl.settings__data__field__label}>
                        New password
                    </label>
                    <input
                        className={cl.settings__data__field__input}
                        type="password"
                        placeholder="New password"
                        ref={newPasswordInputRef} />
                </div>
                <div className={cl.settings__data__field}>
                    <label className={cl.settings__data__field__label}>
                        Confirm new password
                    </label>
                    <input
                        className={cl.settings__data__field__input}
                        type="password"
                        placeholder="Confirm new password"
                        ref={passwordConfirmInputRef} />
                </div>
                <div className={cl.settings__data__control}>
                    <button
                        className={cl.settings__data__control__apply}
                        disabled={isSaving}
                        onClick={changePasswordRequest}>
                        Change password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
