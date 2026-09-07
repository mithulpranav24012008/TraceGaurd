import { useContext } from 'react';
import { SettingsContext, SettingsContextType } from './SettingsContext';

export const useSettings = (): SettingsContextType => useContext(SettingsContext);
