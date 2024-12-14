import { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import css from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { i18n } = useTranslation();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang); // Store selected language in localStorage
    setShowDropdown(false); // Close dropdown after selection
  };

  return (
    <div className={css.languageSwitcherContainer}>
      <button onClick={toggleDropdown} className={css.languageSwitcherButton}>
        <FaGlobe size={24} />
      </button>

      {showDropdown && (
        <div className={css.languageDropdown}>
          <ul>
            <li>
              <button onClick={() => handleLanguageChange('en')} className={css.languageButton}>
                English
              </button>
            </li>
            <li>
              <button onClick={() => handleLanguageChange('es')} className={css.languageButton}>
                Español
              </button>
            </li>
            <li>
              <button onClick={() => handleLanguageChange('tamazight')} className={css.languageButton}>
                الأمازيغية
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
