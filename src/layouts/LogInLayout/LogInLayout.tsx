import React from "react";
import cl from "./.module.css";
import useRefDimensions from "../../hooks/useRefDimensions";

const LogInLayout: React.FC = () => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const formDimensions = useRefDimensions(formRef);

  return (
    <div className={cl.log_in__background}>
      <form
        className={`${cl.log_in} ${formDimensions.height > window.innerHeight ? cl.fixed : ""
          }`}
      >
        <h1 className={cl.log_in__header}>
          <span>
            Log in
            <span className={cl.log_in__header__service_name}>MedBlock</span>
          </span>
        </h1>
        <div className={cl.log_in__data}>
          <input
            className={cl.log_in__data__input}
            type="email"
            placeholder="Email address"
          />
          <input
            className={cl.log_in__data__input}
            type="password"
            placeholder="Password"
          />
        </div>
        <button className={cl.log_in__submit} type="submit">
          Log in
        </button>
      </form>
    </div>
  );
};

export default LogInLayout;
