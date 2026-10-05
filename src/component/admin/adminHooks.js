import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { parseApiError } from '@/component/admin/adminHelpers.js';

// search boxes wait ~400 ms
export function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

/**

 *  401 -> delete token, go to login
 *  403 -> go to home

 */
export function useAdminErrorHandler() {
    const navigate = useNavigate();
    return useCallback(
        (err) => {
            const parsed = parseApiError(err);
            if (parsed.status === 401) {
                localStorage.removeItem('my_app_token');
                navigate('/login', { replace: true });
            } else if (parsed.status === 403) {
                navigate('/home', { replace: true });
            }
            return parsed;
        },
        [navigate]
    );
}

// Success / error (hides)
export function useToast() {
    const [toast, setToast] = useState(null);
    useEffect(() => {
        if (!toast) return undefined;
        const t = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(t);
    }, [toast]);
    const showToast = useCallback((type, text) => setToast({ type, text }), []);
    return { toast, showToast };
}

/**
 * Keeps list filters in the URL (so a refresh keeps them).

 */
export function useUrlFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const get = (key, fallback = '') => searchParams.get(key) ?? fallback;

    const setFilter = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value === '' || value === null || value === undefined) next.delete(key);
        else next.set(key, value);
        if (key !== 'page') next.delete('page');
        setSearchParams(next, { replace: true });
    };

    const setPage = (page) => setFilter('page', page === 0 ? '' : String(page));

    const clearAll = () => setSearchParams(new URLSearchParams(), { replace: true });

    return { searchParams, get, setFilter, setPage, clearAll };
}
