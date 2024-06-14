import { deleteMessage } from "@/app/actions/messageActions";
import { MessageDTO } from "@/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, Key, useCallback, useEffect } from "react";
import useMessageStore from "./useMessageStore";

export const useMessages = (initialMessages: MessageDTO[])=>{
    const {set, remove, messages} = useMessageStore(state => ({
        set: state.set, 
        remove:state.remove, 
        messages: state.messages
    }))
    const router = useRouter();
    //by default we are working with the INBOX container
    const searchParams = useSearchParams();
    const isOutbox = searchParams.get("container") === "outbox";
    const [isDeleting, setDeleting] = useState({ id: "", loading: false });

    useEffect(()=>{
        set(initialMessages)

        return ()=>{
            set([])
        }
    },[initialMessages, set])

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
  
    const handleDeleteMessage = useCallback(
      async (message: MessageDTO) => {
        setDeleting({ id: message.id, loading: true });
        await deleteMessage(message.id, isOutbox);
        router.refresh();
        setDeleting({ id: "", loading: false });
      },
      [isOutbox, router]
    );

    return {
        isOutbox, columns, deleteMessage: handleDeleteMessage, selectRow: handleRowSelect, isDeleting, messages
    }
}