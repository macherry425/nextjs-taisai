// hooks/useGlobal.js
import { useState, useEffect } from 'react';

const useGlobal = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedValue = localStorage.getItem(key);
            return savedValue !== null ? JSON.parse(savedValue) : initialValue;
        }
        return initialValue;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue];
};

export default useGlobal;