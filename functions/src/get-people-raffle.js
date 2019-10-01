import * as functions from "firebase-functions";
import { firestore, auth } from "firebase-admin";

const getPeopleWhoVoted = functions.https.onRequest(async (req, res) => {
  firestore()
    .collectionGroup('feedback')
    .get()
    .then(snapshot => {
      const { docs } = snapshot;
      if (docs && docs.length) {
        const users = {};
        docs.forEach(doc => {
          const data = doc.data();
          if (data.comment && data.comment.trim().length > 0) {
            users[doc.id] = users[doc.id] ? users[doc.id] + 1 : 1;
          }
        });

        if (req.query.count) {
          res.status(200).send(JSON.stringify(users));
        } else {
          res.status(200).send(JSON.stringify(Object.keys(users)));
        }
      } else {
        res.status(500).send(JSON.stringify({error: "No feedback records found."}));
      }
    })
    .catch(err => res.status(500).send(JSON.stringify(err)));
});

export default getPeopleWhoVoted;
