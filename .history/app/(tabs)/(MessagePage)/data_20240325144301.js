import { useAuth } from "@/Context/AuthContext";
import { firestore } from "../../../firebaseConfig";


class Fire {
  db = firestore;
  // 1.
  get ref() {

    return firestore.collection(db, 'messages');
  }
  // 2.
  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  // 3.
  parse = snapshot => {
    // 1.
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    // 2.
    const timestamp = new Date(numberStamp);
    // 3.
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  // 4.
  off() {
    this.ref.off();
  }


  // Send messages
  // 1.
  get uid() {

    return (User.currentUser || {}).uid;
  }
  // 2.
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  // 3.
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      // 4.
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };
  // 5.
  append = message => this.ref.push(message);
}

Fire.shared = new Fire();
export default Fire;