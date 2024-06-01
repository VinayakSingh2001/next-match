import CardInnerWrapper from "@/components/CardInnerWrapper";
import { CardBody, CardHeader, Divider } from "@nextui-org/react";
import React from "react";
import ChatForm from "./ChatForm";

export default function ChatPage() {
  return (
    <CardInnerWrapper
      header="Chat"
      body={<div>Chat goes there</div>}
      footer={<ChatForm />}
    />
  );
}
