import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

const AUDIT_MODE_KEY = 'openwa_audit_mode';

export interface AuditModeContextType {
  auditMode: boolean;
  setAuditMode: (enabled: boolean) => void;
  toggleAuditMode: () => void;
}

export const AuditModeContext = createContext<AuditModeContextType | undefined>(undefined);

export function AuditModeProvider({ children }: { children: ReactNode }) {
  const [auditMode, setAuditModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUDIT_MODE_KEY);
      // Default to true if not set or set to 'true'
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_MODE_KEY, String(auditMode));
    } catch {
      // Ignore storage errors in sandboxed contexts
    }
  }, [auditMode]);

  const setAuditMode = useCallback((enabled: boolean) => {
    setAuditModeState(enabled);
  }, []);

  const toggleAuditMode = useCallback(() => {
    setAuditModeState(prev => !prev);
  }, []);

  return (
    <AuditModeContext.Provider value={{ auditMode, setAuditMode, toggleAuditMode }}>
      {children}
    </AuditModeContext.Provider>
  );
}

export function useAuditMode(): AuditModeContextType {
  const context = useContext(AuditModeContext);
  if (context === undefined) {
    let saved = true;
    try {
      saved = localStorage.getItem(AUDIT_MODE_KEY) !== 'false';
    } catch {
      saved = true;
    }
    return {
      auditMode: saved,
      setAuditMode: () => {},
      toggleAuditMode: () => {},
    };
  }
  return context;
}
