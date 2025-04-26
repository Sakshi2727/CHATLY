import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import axios from 'axios'
import Sidebar from '../Components/miscellaneous/Sidebar'
import MyChats from '../Components/miscellaneous/MyChats'
import ChatBox from '../Components/miscellaneous/ChatBox'
import { Box } from '@chakra-ui/react'
const ChatPage = () => {
  const {user}=ChatState()
  const [fetchAgain,setFetchAgain]=useState(false)
    return (
     <div style={{width:"100%"}}>
      {user && <Sidebar/>}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px" >
      {user && <MyChats fetchAgain={fetchAgain}/>}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
     </div>
  )
}

export default ChatPage
