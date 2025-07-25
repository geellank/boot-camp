// src/pages/_app.js (or pages/_app.js)
import { SettingsProvider } from '../context/SettingsContext'; // Adjust path
import '../styles/globals.css'; // Keep your global styles

function MyApp({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Component {...pageProps} />
    </SettingsProvider>
  );
}

export default MyApp;