import React from 'react';
import cl from './.module.css';

interface Props {
    dialogState: boolean,
    title: string,
    description: string,
    onYesButtonClick: () => void | Promise<void>,
    onNoButtonClick: () => void | Promise<void>
}

const YesNoDialog = React.memo(({
    dialogState,
    title,
    description,
    onYesButtonClick,
    onNoButtonClick
}: Props) => {
    const [processing, setProcessing] = React.useState<boolean>(false);

    const dialogRef = React.useRef<HTMLDialogElement>(null);

    async function yesButtonClick() {
        setProcessing(true);
        await Promise.resolve(onYesButtonClick());
        setProcessing(false);
    }

    async function noButtonClick() {
        setProcessing(true);
        await Promise.resolve(onNoButtonClick());
        setProcessing(false);
    }

    React.useEffect(() => {
        if (dialogState) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [dialogState]);

    return (
        <dialog className={cl.yes_no_dialog}
            ref={dialogRef}>
            <div className={`${cl.yes_no_dialog__content}`}>
                <h1 className={`${cl.yes_no_dialog__header}`}>
                    {title}
                </h1>
                <p className={`${cl.yes_no_dialog__description}`}>
                    {description}
                </p>
            </div>
            <div className={`${cl.yes_no_dialog__control}`}>
                <div className={`${cl.yes_no_dialog__control__buttons}`}>
                    <button className={`${cl.yes_no_dialog__control__buttons__yes}`}
                        disabled={processing}
                        onClick={yesButtonClick}>
                        Yes
                    </button>
                    <button className={`${cl.yes_no_dialog__control__buttons__no}`}
                        disabled={processing}
                        onClick={noButtonClick}>
                        No
                    </button>
                </div>
            </div>
        </dialog>
    );
});

export default YesNoDialog;
