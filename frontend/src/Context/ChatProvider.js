// context provides a way to pass data through the component tree without having to pass props down manually at every level

import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// creating context
const ChatContext = createContext();

// provide the value that need to use direct in diff pages
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  // for displaying lastest msg on chat box to do
  const [newMsg, setNewMsg] = useState([]);

  const history = useHistory();

  useEffect(() => {
    //   fetching userinfo from local storage that is logged in or signed up
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    //   if user not logged in then redirect to homepage
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        newMsg,
        setNewMsg,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// use the context
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
