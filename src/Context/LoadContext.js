import React, { createContext, useState, useContext } from 'react';

const LoadContext = createContext(null);

export const LoadProvider = ({ children }) => {
    const [loadState, setLoadState] = useState(true);

    const startLoading = () => {setLoadState(true)}
    const stopLoading = () => {setLoadState(false)}

    const value = {
        loadState,
        startLoading,
        stopLoading
    };
    
    return <LoadContext.Provider value={value}>{children}</LoadContext.Provider>;
};

export const useLoad = () => {
    return useContext(LoadContext);
};