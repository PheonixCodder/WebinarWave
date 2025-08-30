// PlusIcon.tsx
import React from "react";
import { Plus } from "lucide-react";

interface IconProps { size?: number; color?: string; active?: boolean; }

const PlusIcon: React.FC<IconProps> = ({ size = 24, color = "white", active = false }) => (
  <div style={{
    backgroundColor: active ? "#6E44FF" : "transparent",
    borderRadius: "8px", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <Plus size={size} color={color} strokeWidth={2} />
  </div>
);
export default PlusIcon;
