"use client";
import {MessageDTO} from '@/types'
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Key } from "react";

type Props = {
    messages: MessageDTO[]
}

export default function MessageTable({messages}:Props) {
    const router = useRouter()
  //by default we are working with the INBOX container
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";
  const handleRowSelect = (key:Key)=> {
    const message = messages.find(m => m.id === key);
    const url = isOutbox ? `/members/${message?.recipientId}`:`/members/${message?.senderId}`
    router.push(url + '/chat');
  }
  const columns = [
    {
      key: isOutbox ? "recipientName" : " senderName",
      label: isOutbox ? "Recipient" : "Sender",
    },
    { key: "text", label: "Message" },
    { key: "created", label: isOutbox ? "Date sent" : "Date recieved" },
    
  ];

  return (
    <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
        <Table
      aria-label="Table with messages"
      selectionMode="single"
      onRowAction={(key) => {handleRowSelect(key)}}
      shadow='none'
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={messages} emptyContent='No Message for this container'>
            {(item)=>(
                <TableRow key={item.id} className='cursor-pointer'>
                    {(columnKey)=>(
                        <TableCell>
                          <div className={`${!item.dateRead && !isOutbox? 'font-semibold':''}`}>
                          {getKeyValue(item, columnKey)}
                          </div>
                            
                        </TableCell>
                    )}
                </TableRow>
            )}
      </TableBody>
    </Table>
    </Card>
  );
}
