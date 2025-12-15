import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

function ChatPage() {
  const { logout } = useAuthStore();
  return (
    <div className='flex flex-col items-center justify-center z-10'>
        <h1 className='text-3xl font-bold text-white'>Chat Page</h1>
        <button onClick={logout}  className=' bg-red-500 text-white px-4 py-2 rounded-md'>退出登录</button>
    </div>
  )
}

export default ChatPage
