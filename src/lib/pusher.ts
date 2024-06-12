import PusherServer from "pusher";
import PusherClient from "pusher-js";

declare global {
    var pusherServerInstance :PusherServer | undefined
    var pusherClientInstance :PusherClient | undefined
}

if(!global.pusherServerInstance){
    global.pusherServerInstance = new PusherServer({
        appId:process.env.PUSHER_APP_ID!,
        key : process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
        secret: process.env.PUSHER_SECRET!,
        cluster: 'ap2',
        useTLS:true
    })
}

if(!global.pusherClientInstance){
    global.pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
<<<<<<< HEAD
        channelAuthorization:{
            endpoint:'/api/pusher-auth',
            transport:'ajax'
        },
=======
>>>>>>> 08f073ce01c7fc0fc51a9b12530a1042b14ed11f
        cluster:'ap2'
    })
}

export const pusherServer = global.pusherServerInstance
export const pusherClient = global.pusherClientInstance