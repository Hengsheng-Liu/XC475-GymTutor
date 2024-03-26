
import { firestore } from '../../../firebaseConfig';

import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

class Fire {

  constructor() {

    this.db = firestore;
  }
  // 1.
  get ref() {
    return collection(this.db, 'messages');
  }
  // 2.
  on = callback => {
    const q = query(this.ref, orderBy('createdAt', 'desc'), limit(20)); // Create a query

    this.unsubscribe = onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          callback(this.parse(change.doc));
        }
      });
    });
  }
  // 3.
  parse = document => {
    const data = document.data();
    const _id = document.id;
    const timestamp = data.createdAt ? data.createdAt.toDate() : new Date();
    const message = {
      _id,
      timestamp,
      ...data,
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

    return (getAuth().currentUser || {}).uid;
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