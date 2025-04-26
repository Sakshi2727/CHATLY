import { FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { React, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState();
    
    const navigate = useNavigate();  // Initialize navigate hook
    const toast = useToast();

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please fill details",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "content-type": "application/json",
                },
            };

            const { data } = await axios.post("api/user/login", { email, password }, config);

            toast({
                title: "Login successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));

            // Use navigate to redirect
            navigate("/chats");
        } catch (error) {
            toast({
                title: "Error occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <VStack color='black'>
            <FormControl id='email' isRequired>
                <FormLabel>Email </FormLabel>
                <Input placeHolder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeHolder='Enter Your password' onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button isLoading={loading} colorScheme='blue' width='100%' style={{ marginTop: 15 }} onClick={submitHandler}>
                Login
            </Button>
        </VStack>
    );
};

export default Login;
