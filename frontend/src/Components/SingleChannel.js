import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { BiMessageDots } from "react-icons/bi";

import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { ArrowBackIcon, Icon } from "@chakra-ui/icons";
import {
  MdCall,
  MdAttachFile,
  MdDelete,
  MdManageAccounts,
} from "react-icons/md";

import { FaBloggerB } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const SingleChannel = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChannel, setSelectedChannel, user, newMsg, setNewMsg } =
    ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Chats");

  const toast = useToast();
  const history = useHistory();

  const handleClick = (component) => {
    setSelectedItem(component);
  };

  //   const fetchMessages = async () => {
  //     if (!selectedChat) return;

  //     try {
  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       };

  //       setLoading(true);

  //       const { data } = await axios.get(
  //         `/api/message/${selectedChat._id}`,
  //         config
  //       );
  //       setMessages(data);
  //       // console.log("decrypt data ", data);

  //       setLoading(false);

  //       socket.emit("join chat", selectedChat._id);
  //     } catch (error) {
  //       toast({
  //         title: "Error Occured!",
  //         description: "Failed to Load the Messages",
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //         position: "bottom",
  //       });
  //     }
  //   };

  //   const sendMessage = async (event) => {
  //     // if enter key is pressed and newMessage is typed
  //     // if (transcript) {
  //     //   setNewMessage(transcript);
  //     //   // resetTranscript;
  //     // }
  //     if (event.key === "Enter" && newMessage) {
  //       socket.emit("stop typing", selectedChat._id);
  //       try {
  //         const config = {
  //           headers: {
  //             "Content-type": "application/json",
  //             Authorization: `Bearer ${user.token}`,
  //           },
  //         };

  //         setNewMessage("");
  //         const cipherText = CryptoJS.AES.encrypt(
  //           newMessage,
  //           "my-secret-key@123"
  //         ).toString();
  //         const { data } = await axios.post(
  //           "/api/message",
  //           {
  //             content: cipherText,
  //             chatId: selectedChat,
  //           },
  //           config
  //         );

  //         socket.emit("new message", data);
  //         setMessages([...messages, data]);
  //         setNewMsg([...newMsg, data]);
  //       } catch (error) {
  //         toast({
  //           title: "Error Occured!",
  //           description: "Failed to send the Message",
  //           status: "error",
  //           duration: 5000,
  //           isClosable: true,
  //           position: "bottom",
  //         });
  //       }
  //     }
  //   };

  //   const handleButtonClick = (e) => {
  //     e.preventDefault();
  //     if (SpeechRecognition.browserSupportsSpeechRecognition()) {
  //       if (listening) {
  //         SpeechRecognition.stopListening();
  //       } else {
  //         SpeechRecognition.startListening({ continuous: true });
  //       }
  //     }
  //   };

  return (
    <>
      {selectedChannel ? (
        <>
          <Box width="100%" m={0} bg={"#fffff"}>
            <Text
              justifyContent={"center"}
              w="100%"
              display={"flex"}
              fontSize={"2xl"}
              fontWeight={"semibold"}
            >
              {selectedChannel.channelName}
            </Text>
            <Text
              justifyContent={"center"}
              w="100%"
              display={"flex"}
              fontSize={"md"}
              fontWeight={"light"}
            >
              {selectedChannel.discription}
            </Text>
            <Stack
              spacing={5}
              mt={1}
              direction={"row"}
              justifyContent={"center"}
            >
              <Box
                onClick={() => {
                  handleClick("Chats");
                }}
                display="flex"
                cursor="pointer"
                color={"black"}
                key={1}
                w={"4.5%"}
                style={{
                  borderBottomColor:
                    selectedItem === "Chats" ? "#4c6ed5" : "#ffffff",
                  borderBottomWidth: selectedItem === "Chats" ? "2px" : "0px",
                }}
              >
                <Icon
                  as={FaBloggerB}
                  ml={{ md: 3, sm: 3, base: 3 }}
                  boxSize={{ md: 6, sm: 5, base: 5 }}
                  h={{ md: 12, sm: 12, base: 12 }}
                />
              </Box>

              <Box
                onClick={() => {
                  handleClick("Channel");
                }}
                display="flex"
                cursor={"pointer"}
                color={"black"}
                key={2}
                w={"4.5%"}
                style={{
                  borderBottomColor:
                    selectedItem === "Channel" ? "#4c6ed5" : "#ffffff",
                  borderBottomWidth: selectedItem === "Channel" ? "2px" : "0px",
                }}
              >
                <Icon
                  as={MdManageAccounts}
                  ml={{ md: 3, sm: 3, base: 3 }}
                  boxSize={{ md: 6, sm: 5, base: 5 }}
                  h={{ md: 12, sm: 12, base: 12 }}
                />
              </Box>
            </Stack>
          </Box>

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
            <HStack>
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChannel("")}
              />
              {/* <IconButton
                display={{ base: "flex" }}
                icon={<MdDelete />}
                // fontSize="25px"
                onClick={onOpen}
                // colorScheme={"whatsapp"}
                ml={{ md: "0px!important" }}
              /> */}
              <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader>Delete Channel</AlertDialogHeader>
                    <AlertDialogBody>
                      {"Are you sure want to delete chat?"}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button onClick={onClose} ml={3}>
                        NO
                      </Button>
                      <Button
                        //   onClick={deleteHandler}
                        colorScheme="red"
                        ml={3}
                      >
                        YES
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </HStack>

            {/* if group chat selected show group chat ui and if not group chat then show  user name and profile*/}
          </Text>
          {selectedItem === "Chats" && (
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
                  {/* <ScrollableChat messages={messages} /> */}
                </div>
              )}

              <FormControl
                //   onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
                {/* {istyping ? (
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
              )} */}
                <HStack>
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message..."
                    //   onClick={handleInputClick}
                    //   onChange={typingHandler}
                    //   value={newMessage || transcript}
                  />

                  {/* <IconButton
                  icon={<MdOutlineMic />}
                  colorScheme="blue"
                  variant="solid"
                  // onClick={speechToText}
                  //   onClick={handleButtonClick}
                ></IconButton> */}

                  <IconButton
                    icon={<MdAttachFile />}
                    colorScheme="blue"
                    // backgroundColor="#E0E0E0"
                    variant="solid"
                  ></IconButton>
                </HStack>
              </FormControl>
            </Box>
          )}
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
            Click on a channel
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChannel;
