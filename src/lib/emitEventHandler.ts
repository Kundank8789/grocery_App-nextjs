import axios from 'axios'
import React from 'react'

function emitEventHandler( event: string, data: unknown, socketId: string) {
  try {
     axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`, { socketId, event, data })
  } catch (error) {
    console.log(error)
  }
}

export default emitEventHandler