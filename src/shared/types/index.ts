import type { ComponentType } from 'react';

/**
 * Shared types for Command Builder application
 */

/**
 * Represents a command template with placeholders
 */
export type CommandTemplate = {
  /** ID duy nhất cho template */
  id: string;

  /** Tên của module (ví dụ: 'Git', 'Docker') */
  category: string;

  /** Tên hiển thị của template (có thể dùng emoji) */
  name: string;

  /** Mô tả ngắn về template */
  description: string;

  /**
   * Danh sách các 'key' cho placeholder.
   * Ứng dụng sẽ tự động tạo ra các ô Input dựa trên các key này.
   */
  placeholders: string[];

  /**
   * Một mảng các template string hoặc object với note và cmd.
   * Sử dụng cú pháp `${key}` để tham chiếu đến các giá trị từ 'placeholders'.
   * Ví dụ: 'git remote add origin git@${user}:${user}/${repo}.git'
   * Hoặc: { note: 'Mô tả', cmd: 'git remote add origin git@${user}:${user}/${repo}.git' }
   */
  commands: (string | { note?: string; cmd: string })[];
};

/**
 * Một đối tượng Record để lưu trạng thái input của người dùng.
 * Key là placeholder (ví dụ: 'user'), value là giá trị (ví dụ: 'gemini-dev')
 */
export type TemplateInputs = Record<string, string>;

export type ModulePageMeta = {
  /** Tiêu đề hiển thị trong trang module */
  title: string;

  /** Mô tả ngắn hiển thị dưới tiêu đề */
  description: string;
};

/**
 * Represents a feature module configuration
 */
export type FeatureModule = {
  /** ID ổn định dùng cho registry và test */
  id: string;

  /** Tên hiển thị của module */
  name: string;

  /** Đường dẫn route */
  path: string;

  /** Thứ tự hiển thị trong navigation */
  order: number;

  /** Icon component */
  icon: ComponentType<{ className?: string }>;

  /** Element component để render */
  element: ComponentType;

  /** Metadata của trang module */
  page: ModulePageMeta;

  /** Danh sách templates của module */
  templates: CommandTemplate[];
};
