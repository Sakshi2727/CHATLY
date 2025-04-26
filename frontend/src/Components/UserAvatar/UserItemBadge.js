import { Box } from '@chakra-ui/react'
import {CloseIcon} from '@chakra-ui/icons'
import React from 'react'

const UserItemBadge = ({user,handleFunction}) => {
  return (
    <Box
   
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    fontSize={12}
    variant="solid"
    backgroundColor="blue"
    color="white"
    cursor="pointer"
    onClick={handleFunction}
    width="20%"
    display="inline"
    >
{user.name}
<CloseIcon></CloseIcon>
    </Box>
  )
}

export default UserItemBadge
