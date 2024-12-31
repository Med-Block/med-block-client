import React from "react";
import cl from "./.module.css";
import useRefDimensions from "../../hooks/useRefDimensions";

const LogInLayout: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const formRef = React.useRef<HTMLFormElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  const formDimensions = useRefDimensions(formRef);

  async function logInRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:7000/api/auth/login', {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInputRef.current?.value,
          password: passwordInputRef.current?.value,
        })
      });
  
      if (response.ok) {
        localStorage.setItem('token', await response.text());
        window.location.href = '/';
      } else {
        alert(await response.text());
      }
    } catch (error) {
      alert(`Error while trying to log in: ${error}`);
    }

    setIsSubmitting(false);
  }

  return (
    <div className={cl.log_in__background}>
      <form
        className={`${cl.log_in} ${formDimensions.height > window.innerHeight ? cl.fixed : ""}`}
        onSubmit={logInRequest}>
        <h1 className={cl.log_in__header}>
          <span>
            Log in
            <span className={cl.log_in__header__service_name}>
              MedBlock
            </span>
          </span>
        </h1>
        <div className={cl.log_in__data}>
          <input
            className={cl.log_in__data__input}
            type="email"
            placeholder="Email address"
            ref={emailInputRef} />
          <input
            className={cl.log_in__data__input}
            type="password"
            placeholder="Password"
            ref={passwordInputRef} />
        </div>
        <button
          className={cl.log_in__submit}
          type="submit"
          disabled={isSubmitting}>
          Log in
        </button>
      </form>
    </div>
  );
};

export default LogInLayout;
