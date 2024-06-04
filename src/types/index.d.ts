import { ZodIssue } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
  select:{
    id:true,
    text:true,
    created:true,
    dateRead:true,
    sender:{
      select:{
        userId,name,image
      }
    },
    recipient:{
      select:{
        userId,name,image
      }
    }
  }
}>


//this is a flattend object that im gonna send back from our server action and pass it to the client
type MessageDTO = {
  id:string;
  text:string;
  created:string;
  dateRead:string | null;
  senderId:string;
  senderName?:string;
  senderImage? : string | null;
  recipientId :string
  recipientName?: string
  recipientImage?: string |null
}
//inside our "messageAction" we are specfic about the property that we are returning from the sender so we are using projection.
//That's what it's called when we select just the data we're interested in from the database.Rather than getting every property available for the sender, which we could do, by the way, if we just said we wanted to include sender, that would give us the sender and all of the properties.
//But when we use select, then we're only selecting the specific properties we're interested in."