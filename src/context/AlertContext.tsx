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

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
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
