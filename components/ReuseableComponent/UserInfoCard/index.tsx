import { cn } from "@/lib/utils";
import { Attendee } from "@/lib/generated/prisma";
import React from "react";
type Props = {
  customer: Attendee;
  tags: string[];
  className?: string;
};

const UserInfoCard = ({ customer, tags, className }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full text-primary p-3 gap-3 rounded-xl border-[0.5px] border-border backdrop-blur-[20px] bg-background/10",
        className
      )}
    >
      <h3 className="font-semibold text-xs truncate max-w-full">
        {customer.name}
      </h3>
      <p className="text-sm truncate max-w-full">{customer.email}</p>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-foreground px-3 py-1 rounded-md border border-border text-xs truncate max-w-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserInfoCard;
