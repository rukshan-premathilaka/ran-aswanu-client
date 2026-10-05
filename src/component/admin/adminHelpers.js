// formatting + error reading

export const formatDate = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
};

export const formatDateTime = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString();
};

export const formatNumber = (value) => Number(value ?? 0).toLocaleString();

export const formatMoney = (value) =>
    Number(value ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export const roleLabel = (role) => {
    if (!role || role === 'UNASSIGNED') return 'No role yet';
    return role.charAt(0) + role.slice(1).toLowerCase();
};

/**
 * Reads an axios error the way the guide describes (section 3).
 *  - Shape B: { timestamp, status, error }  -> show `error` as it is
 *  - Shape A: { fieldName: "message" }       -> 400 field validation
 *  - no response                             -> backend is down
 */
export const parseApiError = (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;

    if (!err?.response) {
        return { status: 0, message: 'Cannot reach the server.', fields: {} };
    }
    if (status === 401) {
        return { status, message: 'Please log in again.', fields: {} };
    }
    if (status === 403) {
        return { status, message: 'Only administrators can access this resource.', fields: {} };
    }
    if (status >= 500) {
        return {
            status,
            message: 'Something went wrong on our side. Please try again later.',
            fields: {},
        };
    }

    if (data && typeof data === 'object') {
        if (data.error && data.status) {
            return { status, message: data.error, fields: {} };
        }
        // Shape A: every key is a field name
        const fields = data;
        const message = Object.values(fields).filter((v) => typeof v === 'string').join(' ');
        return { status, message: message || 'The request could not be completed.', fields };
    }

    return { status, message: 'The request could not be completed.', fields: {} };
};

// Preview used in the support list (first 80 characters)
export const preview = (text, max = 80) => {
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max)}…` : text;
};

// Confirm dialog texts (suggested wording from the guide)
export const DISABLE_USER_TEXT =
    'Disable this account? The user will be logged out and can no longer log in. If this user is a farmer, their products are hidden from buyers. You can enable the account again later.';
export const ENABLE_USER_TEXT = 'Enable this account? The user will be able to log in again.';
export const DISABLE_PRODUCT_TEXT =
    'Disable this product? Buyers will no longer see it or be able to order it, and the farmer cannot publish it again until you enable it. The farmer will get a notification.';
export const ENABLE_PRODUCT_TEXT =
    'Enable this product? It goes back to what the farmer chose (published or draft). The farmer will get a notification.';
