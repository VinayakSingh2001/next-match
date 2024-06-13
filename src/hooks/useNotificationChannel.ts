import { pusherClient } from "@/lib/pusher"
import { Channel } from "pusher-js"
import { useEffect, useRef } from "react"

export const useNotificationChannel = (userId:string | null)=>{
    const channelRef = useRef<Channel| null>(null)


    useEffect(()=>{
        if(!userId) return;
        if(!channelRef.current){
            channelRef.current = pusherClient.subscribe(`private-${userId}`);
        }

        return ()=>{
            if(channelRef.current){
                channelRef.current.unsubscribe();
                channelRef.current = null
            }
        }
    },[])
}