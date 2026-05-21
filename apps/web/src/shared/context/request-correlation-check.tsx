import React, { createContext, useContext, useState } from 'react';

interface RequestCorrelationContextType {
  errorMessages: Record<string, string | string[]>;
  setErrorMessages: (messages: Record<string, string | string[]>) => void;
  clearErrorMessages: (id?: string) => void;
  warningMessages: Record<string, string | string[]>;
  setWarningMessages: (messages: Record<string, string | string[]>) => void;
  clearWarningMessages: (id?: string) => void;
}

const functionDefault = () => undefined;

const RequestCorrelationContextValue: RequestCorrelationContextType = {
  errorMessages: {},
  setErrorMessages: functionDefault,
  clearErrorMessages: functionDefault,
  warningMessages: {},
  setWarningMessages: functionDefault,
  clearWarningMessages: functionDefault,
};

const RequestCorrelationCheckContext = createContext<RequestCorrelationContextType>(
  RequestCorrelationContextValue
);

export const RequestCorrelationCheckProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [errorMessages, setErrorMessagesState] = useState<
    RequestCorrelationContextType['errorMessages']
  >({});
  const [warningMessages, setWarningMessagesState] = useState<Record<string, string | string[]>>(
    {}
  );

  const setErrorMessages = (error: Record<string, string | string[]>) => {
    setErrorMessagesState(error);
  };

  const setWarningMessages = (warning: Record<string, string | string[]>) => {
    setWarningMessagesState(warning);
  };

  const clearErrorMessages = (id?: string) => {
    if (id) {
      setErrorMessagesState((prev) => {
        const newErr = { ...prev };
        delete newErr[id];
        return newErr;
      });
    } else {
      setErrorMessagesState({});
    }
  };

  const clearWarningMessages = (id?: string) => {
    if (id) {
      setWarningMessagesState((prev) => {
        const newWarning = { ...prev };
        delete newWarning[id];
        return newWarning;
      });
    } else {
      setWarningMessages({});
    }
  };

  return (
    <RequestCorrelationCheckContext.Provider
      value={{
        errorMessages,
        setErrorMessages,
        clearErrorMessages,
        warningMessages,
        setWarningMessages,
        clearWarningMessages,
      }}
    >
      {children}
    </RequestCorrelationCheckContext.Provider>
  );
};

export const useRequestCorrelationCheck = () => {
  const context = useContext(RequestCorrelationCheckContext);
  return context;
};
