import * as LucideIcons from 'lucide-react';

export const getLucideIcon = (name: string): JSX.Element | null => {
  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ size?: number }>>)[name];
  return IconComponent ? <IconComponent size={24} /> : null;
};
