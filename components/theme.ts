import { extendTheme } from 'native-base';
import { background } from 'native-base/lib/typescript/theme/styled-system';

const theme = extendTheme({
    components:{
        Text:{
            baseStyle:{
                color: "#171717",
            },
        },
        Heading:{
            baseStyle:{
                color: "#171717",
                
            }
        },
    }
  });

  
export default theme;