import { UtensilsCrossed, Fuel, ShoppingBag, ReceiptText, Film, Headphones, ShoppingCart, Circle } from "lucide-react";
import type { Category } from "@/lib/store";

const MAP: Record<Category, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  food: UtensilsCrossed,
  transport: Fuel,
  shopping: ShoppingBag,
  bills: ReceiptText,
  entertainment: Film,
  subscriptions: Headphones,
  groceries: ShoppingCart,
  other: Circle,
};

export function CategoryIcon({ category, className = "h-5 w-5" }: { category: Category; className?: string }) {
  const Icon = MAP[category] ?? Circle;
  return <Icon className={className} strokeWidth={1.75} />;
}
