import { createContext, useContext, useState } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'am' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
