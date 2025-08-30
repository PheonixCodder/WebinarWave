// HomeIcon.tsx
import React from "react";
import { Home } from "lucide-react";

interface IconProps { size?: number; color?: string; active?: boolean; }

const HomeIcon: React.FC<IconProps> = ({ size = 24, color = "white", active = false }) => (
  <div style={{
    backgroundColor: active ? "#6E44FF" : "transparent",
    borderRadius: "8px", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <Home strokeWidth={2} />
  </div>
);
export default HomeIcon;
