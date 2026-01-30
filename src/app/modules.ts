// Import tất cả các module
import { gitModule } from '@/features/git';
import { dockerModule } from '@/features/docker';
import { wordpressModule } from '@/features/wordpress';
import { linuxModule } from '@/features/linux';
import { sshModule } from '@/features/ssh';
import { pythonModule } from '@/features/python';
import { rcloneModule } from '@/features/rclone';

/**
 * Danh sách các feature modules
 * Thêm module mới vào đây để tự động tạo route và sidebar item
 */
export const featureModules = [
    gitModule,
    linuxModule,
    sshModule,
    rcloneModule,
    dockerModule,
    pythonModule,
    wordpressModule,    
];
