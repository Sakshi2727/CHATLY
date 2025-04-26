import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import {ArrowBackIcon} from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogic'
import ProfileModal from '../Components/miscellaneous/ProfileModal'
import UpdateGroup from './miscellaneous/UpdateGroup'
import axios from 'axios'
import './styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client';
const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare
const SingleChat = ({fetchAgain ,setFetchAgain}) => {
  const toast=useToast()
  const [messages,setMessages]=useState([])
  const [loading,setLoading]=useState(false)
  const [socketConnected,setsocketConnected]=useState(false)
  const [newMessage,setnewMessage]=useState([])
    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState()
    useEffect(()=>{
      socket=io(ENDPOINT)
      socket.emit('setup',user)
      socket.on('connection',()=>{
        setsocketConnected(true)
      })
    },[])
    useEffect(()=>{
      fetchMessages()
      selectedChatCompare=selectedChat;

    },[selectedChat])
    // console.log(notification)
    useEffect(()=>{
      socket.on("message recieved",(newMessageRecieved)=>{
        if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat._id){
          // give notifictaion 
          if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved,...notification])
            setFetchAgain(!setFetchAgain)
          }
        }else{
          // add the new message to this message.. 
          setMessages([...messages,newMessageRecieved])
        }
      })
    })
    const sendMessage=async(event)=>{
      if(event.key==="Enter" && newMessage){
        try{
          const config={
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${user.token}`
            }
          }
          setnewMessage("")
          const {data}=await axios.post('/api/message',{
            content:newMessage,
            chatId:selectedChat._id,
          },config)
          // console.log(data) 
          socket.emit("newMessage",data)
          setMessages([...messages,data])

        }catch(error){
          toast({
            title: "Error occured",
            description: error.response.data.message,
    
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
          })

        }
      }
    }
    useEffect(()=>{
      socket=io(ENDPOINT)
      socket.emit('setup',user)
      socket.on('connection',()=>{
        setsocketConnected(true)
      })
    },[])
    const fetchMessages=async()=>{
      if(!selectedChat) return;
      try{
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        setLoading(true)
        const {data}=await axios.get(`/api/message/${selectedChat._id}`,config)
        console.log(data)
        setMessages(data)
        setLoading(false)
        socket.emit('join chat',selectedChat._id)
      }catch(error){
        toast({
          title: "Error occured",
          description: error.response.data.message,
  
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left"
        })

      }
    }
    const typingHandler=(e)=>{
      setnewMessage(e.target.value)
    }
  return( <>
  {selectedChat?(
    <> 
    <Text
    fontSize={{base:"28px",md:"30px"}}
    pb={3}
    px={2}
    position="relative"
    w="100%"
    fontFamily="Work sans"
    display="flex"
    justifyContent={{base:"space-between"}}
    alignItems="center"

    >
      <IconButton  mx={4} d={{base:"flex",md:"none"}} icon={<ArrowBackIcon></ArrowBackIcon>} onClick={()=>setSelectedChat("")}></IconButton>
      {!selectedChat.isGroupChat?(
        <>
        {getSender(user,selectedChat.users)}
        <ProfileModal  user={getSenderFull(user,selectedChat.users)}></ProfileModal>
        </>
      ):(
        <>
        {selectedChat.chatName.toUpperCase()}
        <UpdateGroup fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}></UpdateGroup>
        </>
      )}
    </Text>
    <Box
    display="flex"
    flexDir="column"
    justifyContent="flex-end"
    p={3}
    bg="#E8E8E8"
    w="100%"
    h="90%"
    borderRadius="lg"
    overflowY="hidden"
    >
      {loading?(
        <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto"/>
      ):(
        <div className="messages">  
          <ScrollableChat messages={messages}/>
        </div>
      )}
      <FormControl onKeyDown={sendMessage} isRequired mt={3}>
        <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message" onChange={typingHandler} value={newMessage}/>
      </FormControl>
    </Box>
    </>
    ):(
        <Box
        display="flex" 
        alignItems="center" justifyContent="center" h="100%"
        >
            <Text 
         fontSize="3xl" pb={3} fontFamily="Work sans"> Click on a user to start chatting.</Text>
        </Box>
    )
  }
  </>
  )
}

export default SingleChat
