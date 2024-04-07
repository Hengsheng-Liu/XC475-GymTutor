import { ExpandableCalendar, CalendarProvider, WeekCalendar, CalendarUtils,Calendar} from "react-native-calendars";
import { Box, VStack, Heading } from "native-base";
import { useState,useMemo, useEffect } from "react";
interface CalendarProps {
  history: string[];
}
export default function History(
  {history}: CalendarProps
) {
  useEffect(() => {
    setSelected([...history]);
  }, [history]);
  const date = new Date();
  const [selected, setSelected] = useState(history);
  const marked = (dates: string[]) => {
    const markedDates: { [date: string]: {
        selected: boolean;
        disableTouchEvent: boolean;
        selectedColor: string;
        selectedTextColor?: string;
      };
    } = {};
  
    dates.forEach(date => {
      markedDates[date] = {
        selected: true,
        disableTouchEvent: true,
        selectedColor: '#F97316',
        //selectedTextColor: 'red'
      };
    });
  
    return markedDates;
  };
  
  
  return (
    <Box mt={4}>
      <VStack>
        <Heading mb={2}> Calendar</Heading>
        <Box>
          <Calendar
            current={CalendarUtils.getCalendarDateString(date)}
            markedDates={marked(selected)} // Add type assertion
          />
        </Box>
      </VStack>
    </Box>
  );
}
