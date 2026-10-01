import { createContext, type PropsWithChildren, useContext } from 'react';
import { tokens } from './tokens';

const ThemeContext = createContext(tokens);
export function ThemeProvider({ children }: PropsWithChildren) { return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>; }
export function useTheme() { return useContext(ThemeContext); }
