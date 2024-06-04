import React from 'react'
import MessageSideBar from './MessageSideBar'

export default function MessagesPage() {
  return (
    <div className='grid grid-cols-12 gap-5 h-[80vh] mt-10 '>
     <div className='col-span-2'>
      <MessageSideBar />
     </div>
     <div className="col-span-10">
      meggase
     </div>
    </div>
  )
}
