'use client'

import { useState } from 'react'
import { FloatingButton } from './FloatingButton'
import { ChatWindow } from './ChatWindow'

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <FloatingButton onClick={() => setIsOpen(true)} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
