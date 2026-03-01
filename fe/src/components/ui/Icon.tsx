import { LucideProps } from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'size'> {
  icon: React.ComponentType<LucideProps>;
  size?: number;
  className?: string;
}

export function Icon({ icon: IconComponent, size = 24, className = '', ...props }: IconProps) {
  return (
    <IconComponent
      size={size}
      className={`${className}`}
      {...props}
    />
  );
}
