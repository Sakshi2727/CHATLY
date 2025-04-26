import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initialize as null, not undefined
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification,setNotification]=useState([])
    const navigate=useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if (userInfo && typeof userInfo === "object") {
            setUser(userInfo);
        } else {
            navigate("/"); // Redirect if no user info or invalid
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats,notification,setNotification }}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook to use context easily
export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
