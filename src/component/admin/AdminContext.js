import { createContext, useContext } from 'react';

// the answer of GET /api/me
export const AdminContext = createContext({ me: null });

export const useAdminMe = () => useContext(AdminContext).me;
