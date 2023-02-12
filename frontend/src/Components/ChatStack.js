import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import CryptoJS from "crypto-js";
import axios from "axios";
// import io from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
// var socket;

const ChatStack = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const decryptMsg = (message) => {
    return (message = CryptoJS.AES.decrypt(
      message,
      "my-secret-key@123"
    ).toString(CryptoJS.enc.Utf8));
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // give list of chats
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Stack overflowY="scroll">
      {chats.map((chat) => (
        <Box
          onClick={() => setSelectedChat(chat)}
          cursor="pointer"
          bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
          color={selectedChat === chat ? "white" : "black"}
          px={3}
          py={2}
          borderRadius="lg"
          key={chat._id}
        >
          <Text>
            {!chat.isGroupChat
              ? getSender(loggedUser, chat.users)
              : chat.chatName}
          </Text>
          {chat.latestMessage && (
            <Text fontSize="xs">
              <b>{chat.latestMessage.sender.name} : </b>
              {chat.latestMessage.content.length > 50
                ? decryptMsg(chat.latestMessage.content).substring(0, 51) +
                  "..."
                : decryptMsg(chat.latestMessage.content)}
            </Text>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default ChatStack;
