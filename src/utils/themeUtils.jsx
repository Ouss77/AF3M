import axios from "axios";

export const fetchThemes = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Themes/getAllTheme.php`
  );
  return response.data;
};

// Maps themeID -> { themeName, themeCode } for quick lookup when rendering articles
export const buildThemeMap = (themes) => {
  const map = {};
  themes.forEach((theme) => {
    map[theme.themeID] = {
      themeName: theme.themeName,
      themeCode: theme.themeCode,
    };
  });
  return map;
};
