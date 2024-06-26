import CardInnerWrapper from "@/components/CardInnerWrapper";
import { CardBody, CardHeader, Divider } from "@nextui-org/react";
import React from "react";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/app/actions/messageActions";
import MessageBox from "./messageBox";
import { getAuthUserId } from "@/app/actions/authActions";
import MessageList from "./messageList";
import { createChatId } from "@/lib/util";

export default async function ChatPage({params}:{params:{userId:string}}) {
  //now we need to put the recipientId inside this Function "getMessageThread()" , we can use useParams to get recipientId, BUT AS its a "server side page" we cant use useParams hook
  //we can simply get these form the properties inside the component inself
  const messages = await getMessageThread(params.userId)
  const userId = await getAuthUserId()
  const chatId = createChatId(userId, params.userId)
 
  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <MessageList initialMessages={messages} currentUserId={userId} chatId={chatId} />
      }
      footer={<ChatForm />}
    />
  );
}