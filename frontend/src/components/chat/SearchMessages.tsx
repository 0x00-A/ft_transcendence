import { useState } from 'react';
import css from './SearchMessages.module.css';
import { FiSearch } from 'react-icons/fi';
import { HiArrowLeft } from 'react-icons/hi'; // Import arrow icon

const SearchMessages = () => {
  const [query, setQuery] = useState<string>('');
  const [showIcon, setShowIcon] = useState<boolean>(false);

  const handleInputClick = () => {
    setShowIcon(true);
  };

  const handleIconClick = () => {
    setShowIcon(false);
    setQuery('');
  };

  return (
    <div className={css.searchContainer}>
      <div className={`${css.searchBar} ${showIcon ? css.showIcon : ''}`}>
        {showIcon && (
          <HiArrowLeft className={css.arrowIcon} onClick={handleIconClick} />
        )}
        <FiSearch
          className={`${css.searchIcon} ${showIcon ? css.searchInSide : ''}`}
        />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={handleInputClick}
          className={`${css.searchInput} ${showIcon ? css.shrinkWidth : ''}`}
        />
      </div>
    </div>
  );
};

export default SearchMessages;
