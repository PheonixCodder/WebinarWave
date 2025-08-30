// Spotlight.tsx
import React from "react";
import { Sparkles } from "lucide-react";

interface IconProps { size?: number; color?: string; active?: boolean; }

const Spotlight: React.FC<IconProps> = ({ size = 24, color = "white", active = false }) => (
  <div style={{
    backgroundColor: active ? "#6E44FF" : "transparent",
    borderRadius: "8px", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <Sparkles size={size} color={color} strokeWidth={2} />
  </div>
);
export default Spotlight;
