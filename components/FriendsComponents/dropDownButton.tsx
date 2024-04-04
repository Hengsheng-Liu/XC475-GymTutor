import React from 'react';
import { Popover, Button, Text, Box } from 'native-base';
import { removeFriend } from './FriendFunctions';

interface DropdownButtonProps {
    currUserUID: string;
    friendUID: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ currUserUID, friendUID }) => {
  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <Button {...triggerProps} backgroundColor= "#0284C7" borderRadius={16}>
            <Text fontSize="md" color="#FFF">Edit</Text>
          </Button>
        );
      }}>
      <Popover.Content m={1}>
        <Popover.Arrow />
        <Popover.Body p={2}>
          <Box>
            <Button backgroundColor="#E2E8F0" borderRadius={8} mb={1}onPress={() => removeFriend(currUserUID, friendUID)}>
              <Text fontSize="xs">Unfollow</Text>
            </Button>
            <Button backgroundColor="#E2E8F0" borderRadius={8} mb={1} onPress={() => console.log("Report")}>
              <Text fontSize="xs">Report</Text>
            </Button>
            <Button backgroundColor="#E2E8F0" borderRadius={8} onPress={() => console.log("Share")}>
              <Text fontSize="xs">Share</Text>
            </Button>
          </Box>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
};

export default DropdownButton;