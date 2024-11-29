import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ message, onConfirm, onCancel, show } :
  { message: string, onConfirm: ()=>void, onCancel: ()=>void, show: boolean }
) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          {/* <div className={styles.iconContainer}>
            <i className="bx bx-error text-3xl">&#9888;</i>
          </div> */}
          <div className={styles.textContainer}>
            {/* <p className={styles.title}>Warning!</p> */}
            <p className={styles.title}>{message}</p>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.confirmButton} onClick={onConfirm}>
              Confirm
            </button>
            <button className={styles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
