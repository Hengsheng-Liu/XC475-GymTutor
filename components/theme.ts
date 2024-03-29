import { extendTheme } from 'native-base';
import { background } from 'native-base/lib/typescript/theme/styled-system';

const theme = extendTheme({
    config: {
        initialColorMode: "light",

        colors: {
            primary:{
                50: "#0284C7",
                
            },
            mainColor: {
              50: "#0284C7", // lighter shade of blue
              100: '#BBDEFB', // light shade of blue
              500: '#2196F3', // main blue color
              700: '#1976D2', // darker shade of blue
              // You can define other shades of blue or any other colors you need
            },
            backColor: {
                50: "#FFF", // White background
            },
            textColor: {
                50: "#171717",
                100: "#FFF"
            }
        },
    },
    components:{
        Text:{
            baseStyle:{
                // fontFamily: "Roboto",
                color: "trueGray.900",
                fontSize: "sm",
            },
            variants: {
                subtext: {
                  fontSize: 'sm',
                  color: "trueGray.900"
                },
            },
        },
        Heading:{
            baseStyle:{
                // fontFamily: "Roboto",
                color: "#FFF",
                fontSize:"md",
                fontWeight:"bold"
                
            },
            variants: {
                subheader: {
                  fontSize: 'xs',
                  color: "red"
                },
            }
        },
    }
  });

  
export default theme;