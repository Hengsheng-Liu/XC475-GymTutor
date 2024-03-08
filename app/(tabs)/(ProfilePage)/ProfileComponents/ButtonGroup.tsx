import { Button, HStack,extendTheme } from "native-base";

export default function ButtonGroup(){

    return(
        <HStack space = {3} justifyContent={"space-around"} mt={6} >
            <Button variant ="outline">120 Friends</Button>
            <Button >Check In</Button>
            <Button>Edit</Button>
        </HStack>
    )
}