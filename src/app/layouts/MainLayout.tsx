import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ActivityOutlet } from '@/shared/components';
import { featureModules } from '@/app/modules';

// Tạo danh sách các valid paths từ featureModules
const validPaths = ['', 'about', ...featureModules.map(m => m.path)];

/**
 * Main Layout - Layout chính cho toàn bộ ứng dụng
 * Sử dụng ActivityOutlet để giữ state của các pages khi chuyển đổi
 */
export function MainLayout() {
    const location = useLocation();
    const currentPath = location.pathname.replace(/^\//, '');
    
    // Kiểm tra xem có phải trang 404 không
    const isNotFoundPage = !validPaths.includes(currentPath);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex flex-1">
                {/* Sidebar - Hidden on mobile */}
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-full">
                        {isNotFoundPage ? <Outlet /> : <ActivityOutlet />}
                    </div>
                </main>
            </div>
        </div>
    );
}
