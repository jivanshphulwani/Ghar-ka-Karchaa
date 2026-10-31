import React from 'react';
import {
  ShoppingCart,
  Milk,
  Apple,
  Zap,
  Home,
  GraduationCap,
  HeartPulse,
  Fuel,
  Wrench,
  UtensilsCrossed,
  Shirt,
  Gift,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'ShoppingCart':
      return <ShoppingCart {...props} />;
    case 'Milk':
      return <Milk {...props} />;
    case 'Apple':
      return <Apple {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'Fuel':
      return <Fuel {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'Gift':
      return <Gift {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
