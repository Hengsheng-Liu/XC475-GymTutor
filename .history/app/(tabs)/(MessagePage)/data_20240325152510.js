
import { firestore } from '../../../firebaseConfig';
import { collection } from "firebase/firestore";

class Fire {

  constructor() {

    this.db = firestore;
  }
  // 1.
  get ref() {

    console.log(collection(this.db, 'messages'));
    return collection(this.db, 'messages');
  }
  // 2.
  on = callback => {
    // Subscribe to the last 20 documents in the collection

    this.unsubscribe = this.ref.orderBy('createdAt', 'desc').limit(20)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            callback(this.parse(change.doc));
          }
        });
      });
  }
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
    return this.db.FieldValue.serverTimestamp();
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