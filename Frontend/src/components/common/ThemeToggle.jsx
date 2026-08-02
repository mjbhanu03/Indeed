import { useTheme } from '../../context/ThemeContext';

const ICONS = { light: '☀️', dark: '🌙', system: '💻' };
const NEXT_LABEL = { light: 'Switch to Dark', dark: 'Switch to System', system: 'Switch to Light' };

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      title={NEXT_LABEL[theme]}
      aria-label={NEXT_LABEL[theme]}
    >
      <span>{ICONS[theme]}</span>
      <span style={{ textTransform: 'capitalize' }}>{theme}</span>
    </button>
  );
}
