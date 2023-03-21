import { ArrowBackIcon, Icon } from "@chakra-ui/icons";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text, Stack, HStack } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import CryptoJS from "crypto-js";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { MdCall, MdOutlineMic, MdAttachFile } from "react-icons/md";
import { useHistory } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const inputRef = useRef();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    newMsg,
    setNewMsg,
  } = ChatState();

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const toast = useToast();
  const history = useHistory();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (transcript) {
      inputRef.current.value = transcript;
      setNewMessage(transcript);
    }
  }, [transcript]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // console.log("decrypt data ", data);

      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    // if enter key is pressed and newMessage is typed
    // if (transcript) {
    //   setNewMessage(transcript);
    //   // resetTranscript;
    // }
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const cipherText = CryptoJS.AES.encrypt(
          newMessage,
          "my-secret-key@123"
        ).toString();
        const { data } = await axios.post(
          "/api/message",
          {
            content: cipherText,
            chatId: selectedChat,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setNewMsg([...newMsg, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (SpeechRecognition.browserSupportsSpeechRecognition()) {
      if (listening) {
        SpeechRecognition.stopListening();
      } else {
        SpeechRecognition.startListening({ continuous: true });
      }
    }
  };

  const handleInputClick = () => {
    resetTranscript();
    // setNewMessage("");
  };

  // const handleInputChange = (e) => {
  //   setNewMessage(e.target.value);
  // };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      // if we are in karan chat and sejal sent msg to hemang then that msg will not render in karan's chat but that will be displayed in notification
      // setNewMsg(true);
      if (
        // if chat is not selected or selected chat's id not eq to newmsg.chat's id then give it to notification

        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  // typing functionality
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      // &&typing is not needed i guess
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const startVideoCall = () => {
    history.push("/video-call");
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {/* arrow back icon if screen is small */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {/* if group chat selected show group chat ui and if not group chat then show  user name and profile*/}
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {/* oppo. user name and icon */}
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {/* group name */}
                  {selectedChat.chatName.toUpperCase()}
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <IconButton
                      icon={<MdCall />}
                      colorScheme="green"
                      variant="solid"
                      w={"8px"}
                      mr={"10px"}
                      onClick={startVideoCall}
                    ></IconButton>

                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </div>
                </>
              ))}
          </Text>

          {/* for displaying text msg */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages ui */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              // {/* messages */}
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={25}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <HStack>
                <Input
                  ref={inputRef}
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message..."
                  onClick={handleInputClick}
                  onChange={typingHandler}
                  value={newMessage || transcript}
                />

                <IconButton
                  icon={<MdOutlineMic />}
                  colorScheme="blue"
                  variant="solid"
                  // onClick={speechToText}
                  onClick={handleButtonClick}
                ></IconButton>

                <IconButton
                  icon={<MdAttachFile />}
                  colorScheme="blue"
                  // backgroundColor="#E0E0E0"
                  variant="solid"
                ></IconButton>
              </HStack>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        // if chat not seleced

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
