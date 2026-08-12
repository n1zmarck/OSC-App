import React from 'react';
import { type NodeColorVariant, VARIANT_STYLES } from '../../utils/nodeUtils';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'pill';
  colorRole?: NodeColorVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'secondary',
  colorRole = 'sky',
  size = 'sm',
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}) => {
  const colorConfig = VARIANT_STYLES[colorRole] || VARIANT_STYLES.sky;

  // Base layout styles
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  // Size variants
  const sizeClasses = {
    xs: 'px-2.5 py-1 text-[10px] rounded-xl gap-1.5',
    sm: 'px-3.5 py-2 text-xs rounded-2xl gap-2',
    md: 'px-4 py-2.5 text-xs rounded-2xl gap-2',
    lg: 'px-5 py-3 text-sm rounded-3xl gap-2.5',
  }[size];

  // Appearance variants
  const variantClasses = {
    primary: `${colorConfig.badgeBg} ${colorConfig.badgeText} border ${colorConfig.badgeBorder} hover:brightness-125 shadow-lg shadow-sky-500/10`,
    secondary: 'glass-pill text-slate-200 hover:text-white hover:bg-white/10 border-white/15',
    accent: 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 hover:brightness-110 shadow-lg shadow-sky-500/25',
    danger: 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40',
    ghost: 'p-1.5 rounded-xl hover:bg-white/15 text-slate-300 hover:text-white',
    pill: `glass-pill border ${colorConfig.badgeBorder} ${colorConfig.badgeText} ${colorConfig.badgeBg}`,
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};
