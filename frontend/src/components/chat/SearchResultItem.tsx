import React from 'react';
import css from './SearchResultItem.module.css';

interface SearchResultItemProps {
  avatar: string;
  name: string;
  // onClick: () => void;
}

// onClick={onClick}
const SearchResultItem: React.FC<SearchResultItemProps> = ({
  avatar,
  name,
  // onClick,
}) => {
  return (
    
    <div className={css.searchResultItem}>
      <img src={avatar} alt={name} className={css.avatar} />
      <span className={css.name}>{name}</span>
    </div>
  );
};

export default SearchResultItem;
