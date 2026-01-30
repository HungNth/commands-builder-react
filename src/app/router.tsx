import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { RootError } from './layouts/RootError';
import { featureModules } from './modules';

// Pages
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Tự động tạo routes từ feature modules
 */
const featureRoutes = featureModules.map((module) => ({
        path: module.path,
        element: <module.element />,
    }
));

/**
 * Router configuration với dynamic routes
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <RootError />,
        children: [
            {index: true, element: <HomePage />},
            ...featureRoutes, // Tự động thêm routes từ modules
            {path: 'about', element: <AboutPage />},
            {path: '*', element: <NotFoundPage />},
        ],
    },
]);

// Re-export featureModules for backward compatibility
export { featureModules } from './modules';
