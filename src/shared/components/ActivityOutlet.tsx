import { Activity } from 'react';
import { useLocation } from 'react-router-dom';
import { featureModules } from '@/app/modules';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';

/**
 * ActivityOutlet - Thay thế Outlet để sử dụng Activity component
 * Giữ state của tất cả các pages khi chuyển đổi
 */
export function ActivityOutlet() {
    const location = useLocation();
    const currentPath = location.pathname.replace(/^\//, '') || '';

    // Kiểm tra xem đang ở trang nào
    const isHome = currentPath === '';
    const isAbout = currentPath === 'about';
    const activeModule = featureModules.find(m => m.path === currentPath);

    return (
        <>
            {/* Home Page */}
            <Activity mode={isHome ? 'visible' : 'hidden'}>
                <HomePage />
            </Activity>

            {/* About Page */}
            <Activity mode={isAbout ? 'visible' : 'hidden'}>
                <AboutPage />
            </Activity>

            {/* Feature Module Pages */}
            {featureModules.map((module) => {
                const ModuleComponent = module.element;
                const isActive = activeModule?.path === module.path;
                
                return (
                    <Activity 
                        key={module.path} 
                        mode={isActive ? 'visible' : 'hidden'}
                    >
                        <ModuleComponent />
                    </Activity>
                );
            })}
        </>
    );
}
