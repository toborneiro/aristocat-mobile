import { createContext, type PropsWithChildren, useContext } from 'react';

type ToastContextValue = { show: (_message: string) => void };
const ToastContext = createContext<ToastContextValue>({ show: () => undefined });
export function ToastProvider({ children }: PropsWithChildren) { return <ToastContext.Provider value={{ show: () => undefined }}>{children}</ToastContext.Provider>; }
export function useToast() { return useContext(ToastContext); }
