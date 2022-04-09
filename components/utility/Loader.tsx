import React, { useCallback, useState } from 'react';

interface LoaderProps<T extends any[]> {
    action: (...args: T) => Promise<void>;
    children: (apply: (...args: T) => Promise<void>, isLoading: boolean, error?: Error) => JSX.Element;
}

export const Loader = <T extends any[], >({ action, children }: LoaderProps<T>): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const apply = useCallback(async (...args: T) => {
        setLoading(true);
        try {
            await action(...args);
        } catch (e) {
            if (e instanceof Error) {
                setError(error);
            }
        }
    }, [action]);

    return children(apply, loading, error);
};