import { ExpandableCalendar, CalendarProvider, WeekCalendar, CalendarUtils,Calendar, DateData} from "react-native-calendars";
import { Box, VStack, Heading } from "native-base";
import { useState,useMemo, useEffect} from "react";
import { StyleSheet } from "react-native";
import { DailyCheckIn } from "../FirebaseUserFunctions";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { router } from "expo-router";
interface CalendarProps {
  history: DailyCheckIn[];
}
export default function History(
  {history}: CalendarProps
) {
  useEffect(() => {
    setSelected([...history]);
    console.log('history', history)
  }, [history]);
  const date = new Date();
  const [selected, setSelected] = useState(history);
  const marked = (dates: DailyCheckIn[]) => {
    const markedDates: { [date: string]: {
        selected: boolean;
        disableTouchEvent: boolean;
        selectedColor: string;
        selectedTextColor?: string;
      };
    } = {};
  
    dates.forEach(date => {
      markedDates[date.day] = {
        selected: true,
        disableTouchEvent: false,
        selectedColor: date.photo ? '#00A86B': '#F97316',

      };
    });
  
    return markedDates;
  };
  const onDayPress = (day: DateData) => {
    const dayData = history.find((x) => x.day === day.dateString);
    if(dayData && dayData?.photo) {
      try{
      router.push({pathname: '/PastPhoto2',params:{ pictureUrl: dayData.photo, title: dayData.day}})
      }catch(e){
        console.log(e);
      }
    }
  }
  
  return (
    <Box mt={4}>
      <VStack>
        <Heading mb={3} color="black">Calendar</Heading>
        <Box
            shadow={3} 
            borderRadius={10}
            mb={4}
      > 
          <Calendar
            current={CalendarUtils.getCalendarDateString(date)}
            disableAllTouchEventsForInactiveDays={true}
            markedDates={marked(selected)}

            onDayPress={(day) => {
              onDayPress(day);
            }}
          />
        </Box>
      </VStack>
    </Box>
  );
}
const styles = StyleSheet.create({
});
