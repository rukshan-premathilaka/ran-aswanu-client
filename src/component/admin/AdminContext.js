import { createContext, useContext } from 'react';

// Holds the logged-in admin (the answer of GET /api/me). Filled by AdminGuard.
export const AdminContext = createContext({ me: null });

export const useAdminMe = () => useContext(AdminContext).me;
