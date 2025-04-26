import { FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { React, useState } from 'react';
// const dotenv=require('dotenv')
// dotenv.config()
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Updated import for React Router v6

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();  // Use navigate instead of history
    const handleClick = () => setShow(!show);

    // Image upload function
    const submitimage = async () => {
        if (!pic) {
            toast({
                title: "Please select an image to upload",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("file", pic);
        data.append("upload_preset", "chatapp");
        data.append("cloud_name", "dgnlqd5sw");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dgnlqd5sw/image/upload", {
                method: "post",
                body: data,
            });
            const result = await response.json();
            if (result.url) {
                setPic(result.url);  // Store the URL as a string in `pic`
                toast({
                    title: "Image uploaded successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            } else {
                throw new Error("Failed to upload image.");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            toast({
                title: "Error uploading image",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    // Sign-up submit function
    const submitHandler = async () => {
        setLoading(true);
        if (!email || !name || !password || !confirmpassword) {
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

            const { data } = await axios.post("api/user", { name, email, password, pic }, config);
            toast({
                title: "Registration successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            // Save user data to localStorage
            localStorage.setItem("userInfo", JSON.stringify(data));

            // Redirect using navigate instead of history.push
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
            <FormControl id='firstname' isRequired>
                <FormLabel>Name </FormLabel>
                <Input placeHolder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
            </FormControl>
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
            <FormControl id='password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeHolder='Enter Your Confirm password' onChange={(e) => setconfirmpassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic' isRequired>
                <FormLabel>Upload your pic</FormLabel>
                <InputGroup>
                    <Input type='file' accept='image/*' onChange={(e) => setPic(e.target.files[0])} />
                    <InputRightElement width='4.5rem'>
                        <Button h="1.75rem" size="sm" onClick={submitimage}>
                            Upload
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme='blue' width='100%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                SignUp
            </Button>
        </VStack>
    );
};

export default SignUp;

