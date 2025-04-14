import { createContext, useState, useContext, ReactNode } from "react";
import es from "@/assets/languages/es.json";
import en from "@/assets/languages/en.json";

// Tipado de idiomas
type Language = "es" | "en";

// Diccionario de idiomas
const languages = { es, en };

// Crear contexto
const LanguageContext = createContext<any>(null);

// Proveedor del contexto
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>(localStorage.getItem("language") as Language || "es");

    // Cambiar idioma y guardar en localStorage
    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, texts: languages[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useLanguage = () => useContext(LanguageContext);

export const getLanguageQueryParam = (): string => {
    const { language } = useLanguage();
    return language === "en" ? "EN-GB" : "ES"; // Map to DeepL-compatible language codes
};
