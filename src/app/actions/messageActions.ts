'use server'

import { MessageSchema, messageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDTO } from "@/lib/mappings";

//ye ek function h jiski help se hum kisi ko message bheej sakte h
export async function createMessage(recipientUserId:string, data: MessageSchema):Promise<ActionResult<Message>> {
    try {
        const userId = await getAuthUserId();
        const validated = messageSchema.safeParse(data)

        if(!validated.success) return {status:"error", error:validated.error.errors}
        const {text} = validated.data;
        const message  = await prisma.message.create({
            data:{text,recipientId: recipientUserId, senderId: userId}
        })

        return {status:'success', data:message}
    } catch (error) {
        console.log(error)
        return {status:'error', error:"something went wrong"}
        
    }
}

//ye function pura converstion wth a user k sath ko database se fetch krta h, initally jo ki absurd forat m hota h (which we directly recieve from the db), then this function converts the recievied payload into a DTO format and then return that payload
export async function getMessageThread(recipientId:string) {
    try {
        const userId = await getAuthUserId()
        //setting both sides of conservation 
        const messages = await prisma.message.findMany({
            where:{
                OR:[{
                    senderId:userId, recipientId,
                },{
                    senderId:recipientId, 
                    recipientId:userId
                }]
            },
            //now we give some ordering to the messages thatis latest message should show on top
            orderBy:{
                created:"asc"
            }, 
            //now get some info about the sender , name , image , the userId and same for the recipient
            select:{
                id:true,
                text:true,
                created:true,
                dateRead:true,
                sender:{
                    select:{
                        userId:true,
                        name:true,
                        image:true
                    }
                },
                recipient:{
                    select:{
                        userId:true,
                        name:true,
                        image:true
                    }
                }
            }
        })
        return messages.map(message=>mapMessageToMessageDTO(message))
    } catch (error) {
        console.log(error)
        throw error
    }
}