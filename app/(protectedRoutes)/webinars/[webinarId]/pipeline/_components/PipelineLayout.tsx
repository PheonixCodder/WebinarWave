import UserInfoCard from "@/components/ReuseableComponent/UserInfoCard";
import { Badge } from "@/components/ui/badge";
import { Attendee } from "@/lib/generated/prisma";
import React from "react";

type Props = {
  title: string;
  count: number;
  users: Attendee[];
  tags: string[];
};

const PipelineLayout = ({ title, count, users, tags }: Props) => {
  return (
    <div className="flex-shrink-0 w-[350px] p-5 border border-border bg-background/10 rounded-xl backdrop-blur-2xl min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium truncate">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>

      {/* Scrollable user list */}
      <div className="space-y-3 max-h-[calc(100vh-300px)] pr-1 scrollbar-thin">
        {users.map((user, index) => (
          <UserInfoCard key={index} customer={user} tags={tags} />
        ))}
      </div>
    </div>
  );
};

export default PipelineLayout;
