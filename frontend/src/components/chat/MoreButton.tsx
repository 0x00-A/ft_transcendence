import css from './MoreButton.module.css';

interface MoreButtonProps {
  onClick: () => void;
}

const MoreButton: React.FC<MoreButtonProps> = () => {
  return (
    <div className={css.moreButton}>
      <img src="/icons/chat/more.svg" alt="Options" />
    </div>
  );
};

export default MoreButton;
