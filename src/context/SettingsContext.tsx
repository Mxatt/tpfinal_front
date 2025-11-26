import { createContext, useState, useEffect, type ReactNode } from 'react';

type Currency = 'EUR' | 'ARS';
type Theme = 'light' | 'dark';
type TimeFormat = '12h' | '24h';

interface Settings {
  currency: Currency;
  theme: Theme;
  timeFormat: TimeFormat;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    let initialSettings: Settings;
    if (savedSettings) {
      initialSettings = JSON.parse(savedSettings);
    } else {
      initialSettings = {
        currency: 'ARS',
        theme: 'dark',
        timeFormat: '24h',
      };
    }

    if ((initialSettings.currency as any) === 'USD') {
      initialSettings.currency = 'ARS';
    }

    return initialSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
