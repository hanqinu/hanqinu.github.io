import { useEffect } from 'react';
import { useLocalStorageState } from 'ahooks';

export function useTheme() {
  const [theme, setTheme] = useLocalStorageState<'dark' | 'light'>('theme', {
    defaultValue: 'dark',
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme: theme ?? 'dark', toggleTheme, isDark: theme !== 'light' };
}
