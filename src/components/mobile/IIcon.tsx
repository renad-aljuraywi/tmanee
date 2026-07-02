import {
  Car, Home as HomeIcon, Plane, Smartphone, Coins, Gem, Award, Trophy, Salad,
  Coffee, Headphones, ShoppingBag, Film, Utensils, Fuel, ShoppingCart, ReceiptText,
  Wallet, TrendingUp, Sparkles, BarChart3, Lightbulb, Shield, Mail, Compass,
  AlertTriangle, Medal, Target as TargetIcon, PiggyBank, Hand, MapPin,
} from "lucide-react";

const MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  // categories / merchants
  "🍔": Utensils, "🍕": Utensils, "🥗": Salad, "☕": Coffee,
  "⛽": Fuel, "🛒": ShoppingCart, "🛍️": ShoppingBag, "🛍": ShoppingBag,
  "🧾": ReceiptText, "🎬": Film, "🎧": Headphones,
  // goals
  "🚗": Car, "🏠": HomeIcon, "✈️": Plane, "✈": Plane, "📱": Smartphone,
  "🪙": Coins, "💍": Gem, "💎": Gem,
  // achievements
  "🏅": Medal, "🏆": Trophy, "🥈": Medal, "🥇": Medal,
  // finance
  "💰": Wallet, "📈": TrendingUp, "📊": BarChart3, "🔮": Sparkles,
  "💡": Lightbulb, "🛡️": Shield, "🛡": Shield, "✉️": Mail, "🧭": Compass,
  "⚠️": AlertTriangle, "⚠": AlertTriangle,
  "🎯": TargetIcon, "🐷": PiggyBank, "👋": Hand, "📍": MapPin,
  "•": Coins,
};

export function IIcon({ e, className = "h-5 w-5" }: { e: string; className?: string }) {
  const Cmp = MAP[e] ?? Sparkles;
  return <Cmp className={className} strokeWidth={1.75} />;
}
