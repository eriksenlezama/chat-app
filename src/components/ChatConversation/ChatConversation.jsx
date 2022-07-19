import React, { useRef, useState, useEffect, useContext } from 'react'
import { SocketContext } from '@/contexts/SocketContext'
import { UsersContext } from '@/contexts/UsersContext'
import css from './chatConversation.module.css'

export const ChatConversation = () => {
  const messageInput = useRef(null)
  const [message, setMessage] = useState('')
  const { Socket } = useContext(SocketContext)
  const { state: { username } } = useContext(UsersContext)
  const [conversation, setConversation] = useState([])

  const sendMessage = () => {
    Socket.emit('sendMessage', { username, message, room: 'main' })
  }

  const enter = (e) => {
    if (e.keyCode === 13) {
      sendMessage()
    }
  }

  useEffect(() => {
    Socket.on('updateConversation', chatItem => {
      setConversation(conv => [...conv, chatItem])
    })
  }, [Socket])

  useEffect(() => {
    messageInput.current.focus()
  }, [])

  return (
    <div className={css.chatContainer}>
      <div className={css.conversation}>
        {
          conversation.map((item, i) => (
            <p key={i}>{item.message}</p>
          ))
        }
      </div>
      <div className={css.message}>
        <input
          ref={messageInput}
          className={css.input}
          id="message"
          value={message}
          onKeyUp={(e) => enter(e)}
          placeholder="Your message..."
          onChange={(e) => setMessage(e.target.value)}
          type="text"
        />
        <button
          type='button'
          className={css.button}
          onClick={sendMessage}
        >&#9658;</button>
      </div>
    </div>
  )
}
