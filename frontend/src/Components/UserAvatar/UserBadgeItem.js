import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";

const UserBadgeItem = ({ user1, handleFunction, admin }) => {
  const { user } = ChatState();
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user1.name}
      {admin._id === user1._id && <span> (Admin)</span>}
      {admin._id === user._id && <CloseIcon pl={1} />}
    </Badge>
  );
};

export default UserBadgeItem;
