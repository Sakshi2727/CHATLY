import React, { useEffect } from 'react'
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Container, Text } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import SignUp from '../Components/Authentication/SignUp'
import { useNavigate } from 'react-router-dom'; 

const Homepage = () => {
  const navigate= useNavigate()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text textAlign='center' fontSize='4xl' fontFamily='Work Sans'>Talk-Ative</Text>
      </Box>
      <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
        <Tabs variant="enclosed">
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
