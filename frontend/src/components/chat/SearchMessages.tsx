import { useState } from 'react';
import css from './SearchMessages.module.css';
import { FiSearch } from 'react-icons/fi';
import { HiArrowLeft } from 'react-icons/hi';

interface SearchMessagesProps {
  onSearch: (query: string) => void;
  onSelectedSearch: (SelectedSearch: boolean) => void;
}

const SearchMessages: React.FC<SearchMessagesProps> = ({
  onSearch,
  onSelectedSearch,
}) => {
  const [query, setQuery] = useState<string>('');
  const [showIcon, setShowIcon] = useState<boolean>(false);

  const handleInputClick = () => {
    setShowIcon(true);
    onSelectedSearch(true);
  };

  const handleIconClick = () => {
    onSelectedSearch(false);
    setShowIcon(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
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
          onChange={handleInputChange}
          onClick={handleInputClick}
          className={`${css.searchInput} ${showIcon ? css.shrinkWidth : ''}`}
        />
      </div>
    </div>
  );
};

export default SearchMessages;
