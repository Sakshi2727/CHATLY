import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserListItem from '../UserAvatar/UserListItem'
import UserItemBadge from '../UserAvatar/UserItemBadge'

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupchatname, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState("")
  const [searchresult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { user, chats, setChats } = ChatState()
  const handleSearch = async (query) => {
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
      // console.log(data) 
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
  const handleGroup = (usertoadd) => {
    if (selectedUsers.includes(usertoadd)) {
      toast({
        title: "User already added",
        description: "Try other",

        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      return
    }
    setSelectedUsers([...selectedUsers, usertoadd])
  }
  const handleSubmit = async () => {
    if (!groupchatname || !selectedUsers) {
      toast({
        title: "Please fill details",
        description: "Try other",

        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      return;
    }
    try {
      const config = {
        headers: {

          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.post('/api/chat/group', {
        name: groupchatname,
        users: JSON.stringify(selectedUsers.map((u) => u._id))

      }, config)
      setChats([data, ...chats])
      onClose()
      toast({
        title: "New group added",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
    } catch (error) {
      toast({
        title: "Error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
    }
  }
  const handleDelete = (deluser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deluser._id))
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input placeholder="Chat name" mb={3} onChange={(e) => setGroupChatName(e.target.value)}></Input>
            </FormControl>
            <FormControl>
              <Input placeholder="Add users" mb={3} onChange={(e) => handleSearch(e.target.value)}></Input>
            </FormControl>
            <Box d="flex" mb={4} flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserItemBadge key={user._id} user={u} handleFunction={() => handleDelete(u)}></UserItemBadge>
              )
              )}
            </Box >
            {loading ? (
              <div>Loading</div>
            ) : (
              searchresult?.slice(0, 4).map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}></UserListItem>)
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create chat
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel
