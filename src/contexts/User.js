import React, { useState, createContext } from "react";

// context: UserContext //
const UserContext = createContext({
    user: { email: null, uid: null },
    dispatch: () => {},
});

// function: UserProvider //
const UserProvider = ({ children }) => {

    // state: 사용자 정보 상태 //
    const [user, setUser] = useState({});

    // function: 사용자 정보 업데이트 함수 //
    const dispatch = ({ email, uid }) => {
        setUser({ email, uid });
    };
    
    const value = { user, dispatch };

    // render: Provider 컴포넌트 렌더링 //
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };