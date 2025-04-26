import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useToast, Tooltip, Spinner } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'; 
import { useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import Chatloading from './Chatloading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogic'

const Sidebar = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setsearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingchat, setLoadingChat] = useState()
  const { user,setSelectedChat,chats,setChats,notification,setNotification} = ChatState()
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const logouthandler = () => {
    localStorage.removeItem('userInfo')
    navigate('/')
  }
  const accessChat=async (userId)=>{
    try{
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`
        }
      }
      const {data}=await axios.post('/api/chat',{userId},config)
      if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
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
  const handlesearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`/api/user?search=${search}`,config);
      setLoading(false)
      setsearchResult(data)
    } catch (error) {
      setLoading(false);

    // Log the full error for debugging
    console.error("Search error:", error);
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
  return (
    <>
      <Box d='flex' position='relative' alignItems='center' bg='white' w='100%' p='5px 10px 5px 10px' borderWidth='5px'>
        <Tooltip label="Search users to chat." hasArrow placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px='4px'>Search User</Text>
          </Button>
        </Tooltip>
        <Text textAlign="center" position="absolute"
          left="50%" display="inline" fontSize='2xl' fontFamily='Work sans'>
          Chit-Chat
        </Text>
        <Menu >
          <MenuButton position="absolute" left="92%" display="inline" p='1'>
            <BellIcon fontSize='2xl'></BellIcon>
          </MenuButton>
          <MenuList>
            {!notification.length && "No new messages"}
            {notification.map((notif)=>(
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n)=>n!==notif));
              }}>
              {notif.chat.isGroupChat?`New message in ${notif.chat.chatName}`:`New messag ein ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton position="absolute" left="95%" display="inline" p='1' as={Button} rightIcon={<ChevronDownIcon></ChevronDownIcon>}>
            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}> </Avatar>
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}> <MenuItem>My Profile</MenuItem></ProfileModal>
            <MenuDivider></MenuDivider>
            <MenuItem onClick={logouthandler}>LogOut</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
        </DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2} width="100%">
              <Input width="auto" placeholder="Search by name" mr={2} value={search} onChange={(e) => setSearch(e.target.value)}></Input>
              <Button position="absolute" left="80%" onClick={handlesearch} >Go</Button>
            </Box>
            {loading ? (
              <Chatloading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
                })
                )}
            {loadingchat && <Spinner ml="auto" d="flex"/>}
          </DrawerBody>
        </DrawerContent>

      </Drawer>
    </>
  )
}

export default Sidebar
