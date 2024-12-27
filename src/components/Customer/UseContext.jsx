import React, { useContext, useState } from "react";

const ThemeContext = createContext("light");

export const handletheme = ({ children }) => {
  const [theme, setTheme] = useState("light");
};

const toggletheme = () => {
  setTheme((prevtheme) => (prevtheme ? "light" : "dark"));
};

return (
  <ThemeContext.Provider value={{ theme, setTheme }}>
    {children}
  </ThemeContext.Provider>
);

const themevalue = () => {
  const { theme } = useContext(ThemeContext);
};

return (
  <>
    <div>
      <li>Current theme:{theme}</li>

      {{ background: theme === "light" ? "#05678" : "" }}
    </div>
  </>
);
