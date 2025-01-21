import React, { useState, createContext } from "react";

// context: ProgressContext //
const ProgressContext = createContext({
    inProgress: false,
    spinner: () => {},
});


// function: ProgressProvider //
const ProgressProvider = ({ children }) => {

    // state: 로딩 상태 //
    const [inProgress, setInProgress] = useState(false);

    const spinner = {
        start: () => setInProgress(true),
        stop: () => setInProgress(false),
    };
    const value = { inProgress, spinner };

    // render: Provider 컴포넌트 렌더링 //
    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};

export { ProgressContext, ProgressProvider };