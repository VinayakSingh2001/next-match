import { MessageDTO } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type MessageState = {
  messages: MessageDTO[];
  add: (message: MessageDTO) => void;
  remove: (id: string) => void;
  set: (messages: MessageDTO[]) => void;
};

const useMessageStore = create<MessageState>()(
  devtools(
    (set) => ({
      messages: [],
      add: (message) =>
        set((state) => ({ messages: [message, ...state.messages] })),
      remove: (id) =>
        set((state) => ({
          messages: state.messages.filter((message) => message.id !== id),
        })),
      set: (messages) => set({ messages }),
    }),
    { name: "messageStore" }
  )
);
