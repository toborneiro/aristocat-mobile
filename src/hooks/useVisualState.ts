export type VisualState = 'default' | 'loading' | 'success' | 'error' | 'empty' | 'disabled' | 'focused' | 'selected';
export function useVisualState(initial: VisualState = 'default') { return { state: initial }; }
