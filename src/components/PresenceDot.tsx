import React from "react";
import { Member } from "@prisma/client";
import usePresenceStore from '@/hooks/usePresenceStore';
import { GoDot, GoDotFill } from 'react-icons/go';

type Props = {
  member: Member;
};

export default function PresenceDot({ member }: Props) {
  const members = usePresenceStore(state => state.members);

  const isOnline = members.indexOf(member.userId) !== -1;

  if (!isOnline) return null;

  return (
    <div>
      <GoDot size={36} className="fill-white absolute -top-[2px] -right-[2px]" />
      <GoDotFill size={36} className="fill-green-500 animate-pulse" />
    </div>
  );
}
