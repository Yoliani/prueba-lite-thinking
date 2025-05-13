import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import Cookies from "js-cookie";

const { Option } = Select;

// Cookie name for storing language preference
const LANGUAGE_COOKIE = "lite_thinking_language";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // Load language preference from cookie on component mount
  useEffect(() => {
    const savedLanguage = Cookies.get(LANGUAGE_COOKIE);
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (value: string) => {
    // Save language preference to cookie (expires in 365 days)
    Cookies.set(LANGUAGE_COOKIE, value, { expires: 365, path: "/" });
    i18n.changeLanguage(value);
  };

  return (
    <Select
      value={Cookies.get(LANGUAGE_COOKIE) ?? i18n.language} // Use value instead of defaultValue to reflect changes
      style={{ width: 100 }}
      onChange={changeLanguage}
      data-testid="language-switcher"
    >
      <Option value="en">English</Option>
      <Option value="es">Español</Option>
    </Select>
  );
};

export default LanguageSwitcher;
