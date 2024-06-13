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
import MessageTableCell from "./MessageTableCell";
import { useMessages } from "@/hooks/useMessages";

type Props = {
  messages: MessageDTO[];
};

export default function MessageTable({ messages }: Props) {
  const {columns, isOutbox, isDeleting, deleteMessage, selectRow} = useMessages(messages)

  //giving user the ablity to delete (via cusom cell) in order to use cusom cell we need a renderCell function
  // const renderCell = useCallback(
  //   (item: MessageDTO, columnKey: keyof MessageDTO) => {
     
  //   },
  //   [isOutbox, isDeleting.id, isDeleting.loading, handleDeleteMessage]
  // );

  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Table with messages"
        selectionMode="single"
        onRowAction={(key) => {
          selectRow(key);
        }}
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              width={column.key === "text" ? "50%" : undefined}
            >
              {column.label}
            </TableColumn>
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
                  {/* {renderCell(item, columnKey as keyof MessageDTO)} */}
                  <MessageTableCell item={item} columnKey={columnKey as string} isOutbox={isOutbox} deleteMessages={deleteMessage} isDeleting={isDeleting.loading &&  isDeleting.id === item.id}  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
