import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ChatBox from "../Components/ChatBox";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import { ChatState } from "../Context/ChatProvider";
import { useHistory } from "react-router-dom";

const ChatPages = () => {
  // taking user state from context api
  const { user, setUser } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    //   fetching userinfo from local storage that is logged in or signed up
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    //   if user not logged in then redirect to homepage
    if (!userInfo) {
      history.push("/");
    }
  }, [useHistory]);

  const history = useHistory();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPages;
