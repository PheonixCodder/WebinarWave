// PipelineIcon.tsx
import React from "react";
import { Share2 } from "lucide-react";

interface IconProps { size?: number; color?: string; active?: boolean; }

const PipelineIcon: React.FC<IconProps> = ({ size = 24, color = "white", active = false }) => (
  <div style={{
    backgroundColor: active ? "#6E44FF" : "transparent",
    borderRadius: "8px", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <Share2 size={size} color={color} strokeWidth={2} />
  </div>
);
export default PipelineIcon;
