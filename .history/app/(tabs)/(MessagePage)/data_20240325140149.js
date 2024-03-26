import { useAuth } from "@/Context/AuthContext";
import { firestore } from "../../../firebaseConfig";


const Fire = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  const ref = firestore.database().ref('messages');

  const parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  useEffect(() => {
    const unsubscribe = ref.limitToLast(20).on('child_added', snapshot => {
      const message = parse(snapshot);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => unsubscribe();
  }, []);

  const send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = { text, user, timestamp: firestore.database.ServerValue.TIMESTAMP };
      ref.push(message);
    }
  };


  return null; // or some JSX if this component should render something
};

export default Fire;