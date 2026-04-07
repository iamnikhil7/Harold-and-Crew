"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type ViewMode = "mobile" | "desktop";

const ViewModeContext = createContext<{ mode: ViewMode; toggle: () => void }>({
  mode: "desktop",
  toggle: () => {},
});

export const useViewMode = () => useContext(ViewModeContext);

export default function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("desktop");
  const [isNativeMobile, setIsNativeMobile] = useState(false);
  const toggle = useCallback(() => setMode((m) => (m === "mobile" ? "desktop" : "mobile")), []);

  // Auto-detect viewport on mount
  useEffect(() => {
    const checkViewport = () => {
      const isMobile = window.innerWidth <= 768;
      setIsNativeMobile(isMobile);
      setMode(isMobile ? "mobile" : "desktop");
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-view", mode);
  }, [mode]);

  return (
    <ViewModeContext.Provider value={{ mode, toggle }}>
      {/* Toggle button — only show on non-mobile screens */}
      {!isNativeMobile && (
        <button
          onClick={toggle}
          aria-label={`Switch to ${mode === "mobile" ? "desktop" : "mobile"} view`}
          className="view-toggle"
        >
          {mode === "mobile" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
          )}
          <span className="view-toggle-label">{mode === "mobile" ? "Desktop" : "Mobile"}</span>
        </button>
      )}

      {/* Render based on mode */}
      {mode === "mobile" && !isNativeMobile ? (
        /* Desktop user previewing mobile — show device frame */
        <div className="device-frame">
          <div className="device-screen">{children}</div>
        </div>
      ) : mode === "mobile" && isNativeMobile ? (
        /* Actual mobile device — full screen, no chrome */
        <div className="mobile-native">
          {children}
        </div>
      ) : (
        /* Desktop mode — full width website */
        <div className="desktop-frame">
          <div className="device-screen">{children}</div>
        </div>
      )}
    </ViewModeContext.Provider>
  );
}
