import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '@/api/adminService.js';
import { hasRole, syncRoleStorage, clearRoleStorage } from '@/utils/roleUtils.js';

function AdminGuard({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        if (!localStorage.getItem('my_app_token')) {
            navigate('/login', { replace: true });
            return () => { cancelled = true; };
        }

        adminService.getMe()
            .then((data) => {
                if (cancelled) return;
                syncRoleStorage(data);
                if (!hasRole(data, 'ADMIN')) {
                    navigate('/home', { replace: true });
                }
            })
            .catch((error) => {
                if (cancelled) return;
                if (error?.response?.status === 401) {
                    localStorage.removeItem('my_app_token');
                    clearRoleStorage();
                    localStorage.removeItem('user');
                    navigate('/login', { replace: true });
                } else {
                    navigate('/home', { replace: true });
                }
            });

        return () => { cancelled = true; };
    }, [navigate]);

    return children;
}

export default AdminGuard;
