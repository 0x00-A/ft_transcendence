import css from './MoreButton.module.css';

interface MoreButtonProps {
  onClick: () => void;
}

const MoreButton: React.FC<MoreButtonProps> = ({ onClick }) => {
  return (
    <div className={css.moreButton} onClick={onClick}>
      <img src="/icons/chat/more.svg" alt="Options" />
    </div>
  );
};

export default MoreButton;
