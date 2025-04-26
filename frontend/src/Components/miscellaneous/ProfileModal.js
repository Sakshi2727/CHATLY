import { ViewIcon } from '@chakra-ui/icons'

import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user,children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
   <>
   {children?(
    <span onClick={onOpen}>{children}</span>
   )
  :(
    <IconButton d={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>
  )}
   <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader      textAlign="center" fontSize='40px' fontFamily='Work sans' >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody position="relative" minHeight="200px">
  <Image
    position="absolute"
    top="40%"
    left="50%"
    transform="translate(-50%, -50%)"
    borderRadius="full"
    boxSize="150px"
    src={user.pic}
    alt={user.name}
  />
  <Text
    position="absolute"
    top="99%"
    left="50%"
    transform="translate(-50%, -50%)"
    fontSize={{ base: "28px", md: "30px" }}
    fontFamily="Work sans"
  >Email:{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
   </>
  )
}

export default ProfileModal
