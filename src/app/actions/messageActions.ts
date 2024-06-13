"use server";

import { MessageSchema, messageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult, MessageDTO } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDTO } from "@/lib/mappings";
import { pusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/util";

//ye ek function h jiski help se hum kisi ko message bheej sakte h
export async function createMessage(
  recipientUserId: string,
  data: MessageSchema
): Promise<ActionResult<MessageDTO>> {
  try {
    const userId = await getAuthUserId();
    const validated = messageSchema.safeParse(data);

    if (!validated.success)
      return { status: "error", error: validated.error.errors };
    const { text } = validated.data;
    const message = await prisma.message.create({
      data: { text, recipientId: recipientUserId, senderId: userId },
      select: messageSelect,
    });

    const messageDTO = mapMessageToMessageDTO(message);
    await pusherServer.trigger(
      createChatId(userId, recipientUserId),
      "message:new",
      messageDTO
    );
    await pusherServer.trigger(`private-${recipientUserId}`, 'message:new', messageDTO)

    return { status: "success", data: messageDTO };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "something went wrong" };
  }
}

//ye function pura converstion wth a user k sath ko database se fetch krta h, initally jo ki absurd forat m hota h (which we directly recieve from the db), then this function converts the recievied payload into a DTO format and then return that payload
export async function getMessageThread(recipientId: string) {
  try {
    const userId = await getAuthUserId();
    //setting both sides of conservation
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId,
            senderDeleted: false,
          },
          {
            senderId: recipientId,
            recipientId: userId,
            recipientDeleted: false,
          },
        ],
      },
      //now we give some ordering to the messages thatis latest message should show on top
      orderBy: {
        created: "asc",
      },
      //now get some info about the sender , name , image , the userId and same for the recipient
      select: messageSelect,
    });

    if (messages.length > 0) {
      const readMessageIds = messages
        .filter(
          (m) =>
            m.dateRead === null &&
            m.recipient?.userId === userId &&
            m.sender?.userId === recipientId
        )
        .map((m) => m.id);

      await prisma.message.updateMany({
        where: { id: { in: readMessageIds } },
        data: { dateRead: new Date() },
      });

      await pusherServer.trigger(
        createChatId(recipientId, userId),
        "messages:read",
        readMessageIds
      );
    }

    return messages.map((message) => mapMessageToMessageDTO(message));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//createing action for getting the messages for the container that we are interested in that is 'INBOX" ans "OUTBOX"
export async function getMessageByContainer(container: string) {
  try {
    const userId = await getAuthUserId();
    //now we need to decide what we are gonna fetch from the db,
    //if we are working with the outbox,then we need to get the messages where the userId is the senderId
    //And if we are working with the inbox, then the userId will be equal to the recipientId

    const conditions = {
      [container === "outbox" ? "senderId" : "recipientId"]: userId,
      ...(container === "outbox"
        ? { senderDeleted: false }
        : { recipientDeleted: false }),
    };
    const messages = await prisma.message.findMany({
      where: conditions,
      orderBy: {
        created: "desc",
      },
      select: messageSelect,
    });
    return messages.map((message) => mapMessageToMessageDTO(message));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
  const userId = await getAuthUserId();
  const selector = isOutbox ? "senderDeleted" : "recipientDeleted";

  try {
    const userId = await getAuthUserId();
    await prisma.message.update({
      where: { id: messageId },
      data: {
        [selector]: true,
      },
    });

    const messageToDelete = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            senderDeleted: true,
            recipientDeleted: true,
          },
          {
            recipientId: userId,
            senderDeleted: true,
            recipientDeleted: true,
          },
        ],
      },
    });
    if (messageToDelete.length > 0) {
      await prisma.message.deleteMany({
        where: {
          OR: messageToDelete.map((m) => ({ id: m.id })),
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const messageSelect = {
  id: true,
  text: true,
  created: true,
  dateRead: true,
  sender: {
    select: {
      userId: true,
      name: true,
      image: true,
    },
  },
  recipient: {
    select: {
      userId: true,
      name: true,
      image: true,
    },
  },
};
