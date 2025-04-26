import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, ViewIcon, useDisclosure, useToast } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserItemBadge from '../UserAvatar/UserItemBadge'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
const UpdateGroup = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupchatname,setgroupchatname]=useState()
    const [search,setSearch]=useState("")
    const [searchresult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)
    const [renameloading,setrenameloading]=useState(false)
    const toast=useToast()
    const {selectedChat,setSelectedChat,user}=ChatState()

    const handleAddUser=async(user1)=>{
      if(selectedChat.users.find((u)=>u._id===user1._id)){
        toast({
          title: "User already exist",
          description: "Please provide a new user name.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        })
        return
      }
      if(selectedChat.groupAdmin._id!==user._id){
        toast({
          title: "Only admins can add someone!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        })
        return
      }
      try{
        setLoading(true)
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        const {data}=await axios.put('/api/chat/groupadd',{
          chatId:selectedChat._id,
          userId:user1._id
        },config)
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setLoading(false)
      }catch(error){
        const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message || "An error occurred";
      toast({
        title: "Error occurred",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      }
    }

    const handleRemove=async(user1)=>{
      if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
        toast({
          title: "Only admins can remove",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        })
        return 
      }
      try{
        setLoading(true)
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        const {data}=await axios.put('/api/chat/delete',{
          chatId:selectedChat._id,
          userId:user1._id
        },config)

        user1._id===user._id?setSelectedChat(null):setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        fetchMessages()
        setLoading(false)
      }catch(error){
        const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message || "An error occurred";
      toast({
        title: "Error occurred",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false)
      }
    }

    const handlerename=async()=>{
      if (!groupchatname) {
        toast({
          title: "Group name required",
          description: "Please provide a new group chat name.",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      if (!user || !selectedChat) {
        toast({
          title: "Invalid operation",
          description: "User or selected chat is not available.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }
  
      try {
        setrenameloading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          '/api/chat/rename',
          { chatId: selectedChat._id, chatName: groupchatname },
          config
        );
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setrenameloading(false);
      } catch (error) {
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message || "An error occurred";
        toast({
          title: "Error occurred",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setrenameloading(false);
        setgroupchatname('');
      }
    };
    const handlesearch=async(query)=>{
      setSearch(query)
    if (!query) return
    try {
      setLoading(true)
      const config = {
        headers: {

          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
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
    <IconButton d={{base:"flex"}} icon={<ViewIcon></ViewIcon>} onClick={onOpen}/>

<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
    fontSize="35px"
    fontFamily="Work sans"
    d="flex"
    justifyContent="center"
    >{selectedChat.chatName}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Box>
        {selectedChat.users.map((u)=>(
          <UserItemBadge key={user._id} user={u} handleFunction={()=>handleRemove(u)}/>
        ))}
      </Box>
      <FormControl display="flex">
        <Input
        placeholder="Chat Name"
        value={groupchatname}
        m={3}
        mt={10}
        ml={1}
        onChange={(e)=>setgroupchatname(e.target.value)}
        >
        </Input>
        <Button
        variant="solid"
        colorScheme="teal"

        m={3}
        mt={10}
        ml={1}
        isLoading={renameloading}
        onClick={handlerename}
        >

          Update
        </Button>
      </FormControl>
      <FormControl display="flex">
        <Input
        placeholder="Add user to group"
        
        mt={1}
        ml={1}
        onChange={(e)=>handlesearch(e.target.value)}
        >
        </Input>
        </FormControl>
        {loading ? (
              <Spinner></Spinner>
            ) : (
              searchresult?.map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)}></UserListItem>)
            )}
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='red' mr={3} onClick={()=>{handleRemove(user)}}>
        Leave Group
      </Button>
      
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  )
}

export default UpdateGroup
