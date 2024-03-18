import { ExpandableCalendar, CalendarProvider } from "react-native-calendars";
import { Box, VStack, Heading } from "native-base";
export default function Calendar() {
  const date = new Date();
  const FormateDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return (
    <Box mt={4}>
      <VStack>
        <Heading mb={2}> Calendar</Heading>
        <Box>
          <CalendarProvider date={FormateDate}>
            <ExpandableCalendar />
          </CalendarProvider>
        </Box>
      </VStack>
    </Box>
  );
}
