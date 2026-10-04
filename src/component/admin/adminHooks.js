import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { parseApiError } from '@/component/admin/adminHelpers.js';

// Returns `value` only after it has stopped changing for `delay` ms (search boxes wait ~400 ms).
export function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

/**
 * Central error handling from the guide (section 3.2):
 *  401 -> delete token, go to login
 *  403 -> go to home
 * Always returns the parsed error ({ status, message, fields }) so the page can show it.
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

// Success / error toast (auto hides)
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
 *  - empty values are removed from the URL
 *  - changing any filter resets `page` to 0
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
