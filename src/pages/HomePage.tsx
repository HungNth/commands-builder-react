import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { featureModules } from '@/app/modules';
import { ArrowRight } from 'lucide-react';

/**
 * Home Page - Trang chủ của ứng dụng
 */
export function HomePage() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    ⚡ Command Builder
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Tạo nhanh các lệnh command line với các template được định
                    nghĩa sẵn. Không cần nhớ cú pháp phức tạp.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mx-auto">
                {featureModules.map((module) => {
                    const Icon = module.icon;
                    return (
                        <Card
                            key={module.path}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{module.name}</CardTitle>
                                </div>
                                <CardDescription>
                                    {module.templates.length} templates có sẵn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link to={module.path}>
                                        Xem templates
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* How It Works */}
            <div className="mt-16 space-y-6">
                <h2 className="text-2xl font-bold text-center">Cách Sử Dụng</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                1️⃣ Chọn Template
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Chọn module và template phù hợp với task bạn
                                muốn thực hiện
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                2️⃣ Nhập Thông Tin
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Điền các thông tin cần thiết vào các trường
                                input
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                3️⃣ Copy & Run
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Copy command được tạo ra và chạy trong terminal
                                của bạn
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
