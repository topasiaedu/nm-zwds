import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

type AlertContextType = {
  message: string;
  type: "info" | "success" | "warning" | "error";
  showAlert: (
    message: string,
    type: "info" | "success" | "warning" | "error"
  ) => void;
  hideAlert: () => void;
  visible: boolean;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "success" | "warning" | "error">(
    "success"
  );
  const [visible, setVisible] = useState(false);
  
  // Use ref to track the current timer to avoid multiple timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showAlert = useCallback(
    (message: string, type: "info" | "success" | "warning" | "error") => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      setMessage(message);
      setType(type);
      setVisible(true);
    },
    []
  );

  const hideAlert = useCallback(() => {
    // Clear timer when manually hiding
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setMessage("");
    setType("info");
    setVisible(false);
  }, []);

  useEffect(() => {
    if (visible) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timer
      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = null;
      }, 10000);
    }

    // Cleanup timer on unmount or when visible changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible]);

  const contextValue = useMemo(
    () => ({ message, type, showAlert, hideAlert, visible }),
    [message, type, showAlert, hideAlert, visible]
  );

  const alertBackground =
    type === "error"
      ? "#b91c1c"
      : type === "warning"
        ? "#b45309"
        : type === "info"
          ? "#1e3a5f"
          : "#15803d";

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {visible && message.length > 0 ? (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-4 right-4 z-[9999] max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-lg"
          style={{
            background: alertBackground,
            color: "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          <div className="flex items-start gap-3">
            <p className="flex-1 leading-snug">{message}</p>
            <button
              type="button"
              onClick={hideAlert}
              aria-label="Dismiss alert"
              className="shrink-0 rounded-md px-1.5 py-0.5 text-xs opacity-80 transition-opacity hover:opacity-100"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </AlertContext.Provider>
  );
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Removed whyDidYouRender to reduce debugging overhead

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
