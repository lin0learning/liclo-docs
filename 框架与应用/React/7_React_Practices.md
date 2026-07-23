# React 项目实践

## Context 上下文注入

使用 `createContext` 与 `useContext` hook，可以让组件间的通信更为方便。我们可以通过 `Provider` 组件注入状态，用 `Consumer` 组件或者 `useContext` api获取状态（推荐后者）。

```tsx
import { useState, createContext, useContext } from "react";

export const MapContext = createContext<{
  activeLine: string;
  setActiveLine: (line: string) => void;
}>({ activeLine: "all", setActiveLine: () => {} });

export default function App() {
  const [active, setActive] = useState("all");
  return (
    <MapContext.Provider value={{active, setActiveLine}}>
      <Child/>
    </MapContext.Provider>
  )
}

function NetworkMap() {
  const {activeLine, setActiveLine} = useContext(MapContext)
  
  const isActive = (line: string) => activeLine === "all" || activeLine === line;
}
```



## IconPicker

在 React 项目，使用 `antd` 搭配 `lucide-react`实现图标选择组件，表单存储图标key

:::code-group

```tsx [MenuIconPicker.tsx]
import { useMemo, useState } from 'react';
import { Button, Empty, Input, Pagination, Popover, Space } from 'antd';
import { Grid3X3, X } from 'lucide-react';
import { menuIconOptions, renderMenuIcon } from '@/shared/lib/menuIcons';
import styles from '../menuIconPicker.module.less';

type MenuIconPickerProps = {
  value?: string;
  onChange?: (value?: string) => void;
};

const pageSize = 24;

export function MenuIconPicker({ onChange, value }: MenuIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOptions = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return menuIconOptions;
    }

    return menuIconOptions.filter(
      (option) => option.value.toLowerCase().includes(keyword) || option.label.toLowerCase().includes(keyword),
    );
  }, [searchText]);

  const pageOptions = filteredOptions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedIcon = renderMenuIcon(value, 16);

  function handleSearch(nextValue: string) {
    setSearchText(nextValue);
    setCurrentPage(1);
  }

  function handleSelect(nextValue: string) {
    onChange?.(nextValue);
    setOpen(false);
  }

  function handleClear() {
    onChange?.(undefined);
    setOpen(false);
  }

  const pickerContent = (
    <div className={styles.iconPickerPanel}>
      <Input.Search allowClear placeholder="搜索图标..." value={searchText} onChange={(event) => handleSearch(event.target.value)} />
      {pageOptions.length > 0 ? (
        <div className={styles.iconGrid}>
          {pageOptions.map((option) => (
            <button
              aria-label={option.label}
              className={option.value === value ? styles.iconButtonSelected : styles.iconButton}
              key={option.value}
              title={`${option.label} / ${option.value}`}
              type="button"
              onClick={() => handleSelect(option.value)}
            >
              {renderMenuIcon(option.value, 18)}
            </button>
          ))}
        </div>
      ) : (
        <Empty description="暂无匹配图标" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      <div className={styles.iconPickerFooter}>
        <Button disabled={!value} icon={<X size={14} />} size="small" type="text" onClick={handleClear}>
          清空
        </Button>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger={false}
          size="small"
          total={filteredOptions.length}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );

  return (
    <Space.Compact block>
      <Input
        readOnly
        allowClear
        placeholder="请选择"
        prefix={selectedIcon}
        value={value}
        onClear={handleClear}
        onClick={() => setOpen(true)}
      />
      <div className={styles.iconPickerTrigger}>
        <Popover
          content={pickerContent}
          open={open}
          placement="bottomRight"
          trigger="click"
          onOpenChange={setOpen}
        >
          <Button aria-label="选择图标" icon={<Grid3X3 size={15} />} type="text" />
        </Popover>
      </div>
    </Space.Compact>
  );
}

```

```less [menuIconPicker.module.less]
.icon-value {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.icon-picker-panel {
  width: 272px;
}

.icon-picker-trigger {
  display: inline-flex;
  width: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  border-left: 0;
  border-radius: 0 6px 6px 0;
  background: #f5f7fa;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-top: 10px;
}

.icon-button,
.icon-button-selected {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    color 0.16s ease;
}

.icon-button:hover,
.icon-button-selected {
  border-color: #1677ff;
  background: #eef6ff;
  color: #1677ff;
}

.icon-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}

```

```tsx [menuIcon.tsx]
import { createElement, type ReactNode } from 'react';
import {
  Activity,
  AlarmClock,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  Cog,
  Database,
  ExternalLink,
  FileText,
  Folder,
  FolderTree,
  Gauge,
  Home,
  LayoutDashboard,
  Link,
  ListTree,
  Map,
  MenuSquare,
  Monitor,
  Network,
  PieChart,
  Route,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  SquareMenu,
  TableProperties,
  TrainFront,
  UserCog,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type MenuIconName = keyof typeof menuIconMap;

export type MenuIconOption = {
  label: string;
  value: MenuIconName;
};

export const menuIconMap = {
  Activity,
  AlarmClock,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  Cog,
  Database,
  ExternalLink,
  FileText,
  Folder,
  FolderTree,
  Gauge,
  Home,
  LayoutDashboard,
  Link,
  ListTree,
  Map,
  MenuSquare,
  Monitor,
  Network,
  PieChart,
  Route,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  SquareMenu,
  TableProperties,
  TrainFront,
  UserCog,
  Users,
  Wrench,
} satisfies Record<string, LucideIcon>;

export const menuIconOptions: MenuIconOption[] = [
  { label: '活动', value: 'Activity' },
  { label: '告警', value: 'AlarmClock' },
  { label: '柱状图', value: 'BarChart3' },
  { label: '通知', value: 'Bell' },
  { label: '文档', value: 'BookOpen' },
  { label: '组织', value: 'Building2' },
  { label: '日历', value: 'CalendarDays' },
  { label: '清单', value: 'ClipboardList' },
  { label: '配置', value: 'Cog' },
  { label: '数据库', value: 'Database' },
  { label: '外链', value: 'ExternalLink' },
  { label: '文件', value: 'FileText' },
  { label: '文件夹', value: 'Folder' },
  { label: '目录树', value: 'FolderTree' },
  { label: '仪表盘', value: 'Gauge' },
  { label: '首页', value: 'Home' },
  { label: '看板', value: 'LayoutDashboard' },
  { label: '链接', value: 'Link' },
  { label: '树列表', value: 'ListTree' },
  { label: '地图', value: 'Map' },
  { label: '菜单', value: 'MenuSquare' },
  { label: '监控', value: 'Monitor' },
  { label: '网络', value: 'Network' },
  { label: '饼图', value: 'PieChart' },
  { label: '路由', value: 'Route' },
  { label: '搜索', value: 'Search' },
  { label: '设置', value: 'Settings' },
  { label: '盾牌', value: 'Shield' },
  { label: '权限', value: 'ShieldCheck' },
  { label: '菜单面板', value: 'SquareMenu' },
  { label: '表格', value: 'TableProperties' },
  { label: '车站', value: 'TrainFront' },
  { label: '用户设置', value: 'UserCog' },
  { label: '用户', value: 'Users' },
  { label: '维修', value: 'Wrench' },
];

export function isMenuIconName(value?: string): value is MenuIconName {
  return Boolean(value && value in menuIconMap);
}

export function renderMenuIcon(icon?: string, size = 16): ReactNode {
  if (!isMenuIconName(icon)) {
    return null;
  }

  return createElement(menuIconMap[icon], { size, strokeWidth: 1.8 });
}

```



:::



## LazyImage

```tsx
import React, { useEffect, useRef, useState, ImgHTMLAttributes } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  // 真实图片地址
  src: string;
  // 占位图片地址（可选）
  placeholderSrc?: string;
  // 图片加载失败时显示的回退图片地址（可选）
  fallbackSrc?: string;
  // Intersection Observer 的 rootMargin 配置，例如 "200px" 表示提前200px触发加载
  rootMargin?: string;
  // Intersection Observer 的 threshold 配置
  threshold?: number | number[];
  // 自定义加载中内容的渲染（可选）
  loadingPlaceholder?: React.ReactNode;
  // 自定义错误内容的渲染（可选）
  errorPlaceholder?: React.ReactNode;
  // 外部样式类名
  className?: string;
}

const removeImageEvents = (img: HTMLImageElement) => {
  img.onload = null;
  img.onerror = null;
};

/**
 *
 * @example
 * <LazyImage
 *   src="https://example.com/large-image.jpg"
 *   placeholderSrc="https://example.com/low-quality-preview.jpg"
 *   fallbackSrc="https://example.com/error-placeholder.jpg"
 *   loadingPlaceholder={<div className="spinner">加载中...</div>}
 *   errorPlaceholder={<div className="error">图片加载失败</div>}
 *   rootMargin="0px 0px 300px 0px"
 *   alt="风景图片"
 *   className="custom-image"
 * />
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E', // 透明1x1像素占位
  fallbackSrc,
  rootMargin = '0px 0px 200px 0px', // 默认向下滚动200px触发加载
  threshold = 0,
  loadingPlaceholder,
  errorPlaceholder,
  className = '',
  alt = '',
  ...restProps
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingRef = useRef<boolean>(false);  // 防止重复加载
  const loadedRef = useRef<boolean>(false);
  const errorRef = useRef<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [shouldShowPlaceholder, setShouldShowPlaceholder] = useState<boolean>(true);

  // 当 src、占位图、回退图等关键 props 变化时，重置懒加载逻辑
  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    const loadImage = (img: HTMLImageElement, imageSrc: string) => {
      if (
        loadedRef.current ||
        isLoadingRef.current ||
        (img.src === imageSrc && !errorRef.current)
      ) {
        return;
      }

      isLoadingRef.current = true;
      setShouldShowPlaceholder(false);
      removeImageEvents(img);

      img.onload = () => {
        loadedRef.current = true;
        errorRef.current = false;
        setLoaded(true);
        setError(false);
        isLoadingRef.current = false;
        removeImageEvents(img);
      };

      img.onerror = () => {
        loadedRef.current = false;
        errorRef.current = true;
        setLoaded(false);
        setError(true);
        isLoadingRef.current = false;
        removeImageEvents(img);

        if (fallbackSrc && img.src !== fallbackSrc) {
          img.src = fallbackSrc;
        }
      };

      img.src = imageSrc;
    };

    loadedRef.current = false;
    errorRef.current = false;
    setLoaded(false);
    setError(false);
    setShouldShowPlaceholder(true);
    isLoadingRef.current = false;
    removeImageEvents(imgElement);

    if (imgElement.src !== placeholderSrc) {
      imgElement.src = placeholderSrc;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!window.IntersectionObserver) {
      loadImage(imgElement, src);
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
        removeImageEvents(imgElement);
      };
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (imgRef.current && !loadedRef.current && !errorRef.current) {
            loadImage(imgRef.current, src);
          }

          if (observerRef.current) {
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold,
      },
    );

    observerRef.current.observe(imgElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      removeImageEvents(imgElement);
    };
  }, [src, placeholderSrc, fallbackSrc, rootMargin, threshold]);

  // 渲染加载占位内容（如果提供了自定义占位符）
  const renderPlaceholder = () => {
    if (!shouldShowPlaceholder || loaded) return null;

    if (error && errorPlaceholder) {
      return <div className="lazy-image-error">{errorPlaceholder}</div>;
    }

    if (!loaded && !error && loadingPlaceholder) {
      return <div className="lazy-image-loading">{loadingPlaceholder}</div>;
    }

    return null;
  };

  return (
    <div className={`lazy-image-container ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imgRef}
        alt={alt}
        className={`lazy-image ${loaded ? 'loaded' : 'loading'} ${error ? 'error' : ''}`}
        style={{
          opacity: loaded ? 1 : 0.6,
          transition: 'opacity 0.3s ease',
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
        {...restProps}
      />
      {renderPlaceholder()}
    </div>
  );
};

export default LazyImage;

```

