import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import Chatloading from './Chatloading'
import { getSender } from '../../config/ChatLogic'
import GroupChatModel from './GroupChatModel'
const MyChats = (fetchAgain) => {
  const [loggedUser,setLoggedUser]=useState()
  const { user,selectedChat,setSelectedChat,chats,setChats} = ChatState()
  const toast=useToast()
  const fetchChats=async()=>{
    try{
      const config = {
        headers: {
         
          Authorization: `Bearer ${user.token}`
        }
      }
      const {data}=await axios.get('/api/chat',config)
      // console.log(data)
      setChats(data)
    }
  catch(error){
    toast({
      title:"error occured",
      description: error.response.data.message,

        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
    })
  }
}
useEffect(()=>{
  setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
  fetchChats()
},[fetchAgain])
  return (
    <Box
    d={{base:selectedChat?"none":"flex",md:"flex"}}
    flexDir="col"
    alignItems="center"
    p={3}
    bg="white"
    w={{base:"100%",md:"31%"}}
    borderRdius="lg"
    borderWidth="1px"
    >
      <Box position="relative"
      pb={3}
      px={3}
      d="flex"
      fontSize={{base:"28px",md:"28px"}}
      fontFamily="Work sans"
      justifyContent="space-between"
      alignItems="center"
      >
        My chats
        <GroupChatModel>
           <Button position="absolute" left="55%"  d="flex" fontSize={{base:"17px",md:"10px" ,lg: "17px"}} rightIcon={<AddIcon></AddIcon>}>New Group Chat</Button>
        </GroupChatModel>
       
      </Box>
      <Box d="flex" 
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="90%"
      borederradius="lg"
      overflowY="hidden"
      >
        {chats?(
          <Stack overflowY="scroll">
            {chats.map((chat)=>(
              <Box
              overflowY="hidden"
               onClick={()=>setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat===chat?"#38B2AC":"E8E8E8"}
              color={selectedChat===chat?"white":"black"}
              px={3}
              py={3}
              borderRadius="lg"
              border="1px solid"
              borderColor={selectedChat === chat ? "#38B2AC" : "gray.300"}
              key={chat._id}
              
              
              >

                <Text >
                  {!chat.isGroupChat?
                  getSender(loggedUser,chat.users)
                  :chat.chatName}
                </Text>
              </Box>
            )

            )}
          </Stack>
        ):(
          <Chatloading/>
        )}
      </Box>
    </Box>
  )
}

export default MyChats
