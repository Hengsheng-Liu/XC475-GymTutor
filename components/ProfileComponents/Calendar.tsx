import { ExpandableCalendar, CalendarProvider } from "react-native-calendars";
import { Box, VStack, Heading } from "native-base";
interface CalendarProps {
  history: string[];
}
export default function Calendar(
  {history}: CalendarProps
) {
  const date = new Date();
  const FormateDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return (
    <Box mt={4}>
      <VStack>
        <Heading mb={2}> Calendar</Heading>
        <Box>
          <CalendarProvider date={FormateDate} >
            <ExpandableCalendar markedDates={history}/>
          </CalendarProvider>
        </Box>
      </VStack>
    </Box>
  );
}
