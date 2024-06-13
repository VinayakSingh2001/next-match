"use client";
import { MessageDTO } from "@/types";
import {
  Avatar,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Key, useCallback, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { deleteMessage } from "../actions/messageActions";
import { truncateString } from "@/lib/util";
import PresenceAvatar from "@/components/PresenceAvatar";

type Props = {
  messages: MessageDTO[];
};

export default function MessageTable({ messages }: Props) {
  const router = useRouter();
  //by default we are working with the INBOX container
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";
  const [isDeleting, setDeleting] = useState({ id: "", loading: false });
  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key);
    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;
    router.push(url + "/chat");
  };
  const columns = [
    {
      key: isOutbox ? "recipientName" : " senderName",
      label: isOutbox ? "Recipient" : "Sender",
    },
    { key: "text", label: "Message" },
    { key: "created", label: isOutbox ? "Date sent" : "Date recieved" },
    { key: "actions", label: "Actions" },
  ];

  const handleDeleteMessage = useCallback(async(message: MessageDTO)=>{
    setDeleting({ id: message.id, loading: true });
    await deleteMessage(message.id, isOutbox);
    router.refresh();
    setDeleting({ id: "", loading: false });
  },[isOutbox, router]) 

  //giving user the ablity to delete (via cusom cell) in order to use cusom cell we need a renderCell function
  const renderCell = useCallback(
    (item: MessageDTO, columnKey: keyof MessageDTO) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "recipientName":
        case "senderName":
          return (
            <div className="flex items-center gap-2 cursor-pointer">
             
            <PresenceAvatar userId={isOutbox? item.recipientId : item.senderId} src={isOutbox? item.recipientImage : item.senderImage} />
              <span>{cellValue}</span>
            </div>
          );
        case "text":
          return <div className="truncate">{truncateString(cellValue, 100)}</div>;
        case "created":
          return cellValue;
        default:
          return (
            <Button isIconOnly variant="light" isLoading={isDeleting.id === item.id && isDeleting.loading} onClick={()=>handleDeleteMessage(item)}>
              <AiFillDelete size={24} className="text-danger" />
            </Button>
          );
      }
    },
    [isOutbox, isDeleting.id, isDeleting.loading, handleDeleteMessage]
  );

  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Table with messages"
        selectionMode="single"
        onRowAction={(key) => {
          handleRowSelect(key);
        }}
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}  width={column.key==='text'?'50%':undefined} >{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={messages}
          emptyContent="No Message for this container"
        >
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell
                  className={`${
                    !item.dateRead && !isOutbox ? "font-semibold" : ""
                  }`}
                >
                  {renderCell(item, columnKey as keyof MessageDTO)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
