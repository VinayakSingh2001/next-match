import PresenceAvatar from '@/components/PresenceAvatar';
import { truncateString } from '@/lib/util';
import { MessageDTO } from '@/types';
import { Button } from '@nextui-org/button';
import React from 'react'
import { AiFillDelete } from 'react-icons/ai';

type Props = {
    item: MessageDTO;
    columnKey: string;
    isOutbox :boolean;
    deleteMessages: (message: MessageDTO) => void;
    isDeleting: boolean;
}

export default function MessageTableCell({item, columnKey, isDeleting, isOutbox, deleteMessages}:Props) {
    const cellValue = item[columnKey as keyof MessageDTO];

    switch (columnKey) {
      case "recipientName":
      case "senderName":
        return (
          <div className="flex items-center gap-2 cursor-pointer">
            <PresenceAvatar
              userId={isOutbox ? item.recipientId : item.senderId}
              src={isOutbox ? item.recipientImage : item.senderImage}
            />
            <span>{cellValue}</span>
          </div>
        );
      case "text":
        return (
          <div className="truncate">{truncateString(cellValue, 100)}</div>
        );
      case "created":
        return cellValue;
      default:
        return (
          <Button
            isIconOnly
            variant="light"
            isLoading={isDeleting}
            onClick={() => deleteMessages(item)}
          >
            <AiFillDelete size={24} className="text-danger" />
          </Button>
        );
    }
}
