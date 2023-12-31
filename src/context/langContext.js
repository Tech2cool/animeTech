import React, { createContext, useContext, useState, useEffect} from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [currentLang, setCurrentLang] = useState('en');
    useEffect(()=>{
        localStorage.getItem("anime_lang") && setCurrentLang(localStorage.getItem("anime_lang"))
    },[])
    const toggleLanguage = () => {
        setCurrentLang(currentLang === 'en' ? 'jp' : 'en');
        localStorage.setItem("anime_lang",currentLang === 'en' ? 'jp' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ currentLang, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    return useContext(LanguageContext);
};
