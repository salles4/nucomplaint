import { signOut } from "firebase/auth";
import { modal } from "./store";
import { firebaseAuth } from "./firebase";
import moment from "moment";

// Minutes before timeout
const MINUTES = 10

export function initSession(){  
  if((localStorage.getItem("timeout") || "0") == "1"){
    modal.set({
      title: "Session Timeout",
      description: "You're session timeout. Please log in again.",
      pOption: "Ok",
      primaryFn: () => { signOut(firebaseAuth); localStorage.removeItem("timeout"); modal.set(null);  }
    })
    return;
  }
  window.addEventListener('click', onEvent)
  window.addEventListener('scroll', onEvent)
  sessionStorage.setItem('last-clicked', `${new Date()}`)
  
  const timer = setInterval(() => {
    const lastClicked = new Date(sessionStorage.getItem("last-clicked")) || new Date();
    const lastClicked1mAgo = moment(lastClicked).add(MINUTES, 'minute')
    console.log('is now after', `${lastClicked1mAgo.format('hh:mm:ss')}`, `${moment().isAfter(lastClicked1mAgo)}`);

    if (moment().isAfter(lastClicked1mAgo)) {
      console.log("cleared session timer");
      localStorage.setItem("timeout", "1")
      clearInterval(timer);
      modal.set({
        title: "Session Timeout",
        description: `You've been inactive for ${MINUTES} minutes. You'll be logged out.`,
        pOption: "Ok",
        primaryFn: () => { signOut(firebaseAuth); localStorage.removeItem("timeout"); modal.set(null); },
        clickableBg: false,
      })
    }
  }, 10000)

}

function onEvent(){
  sessionStorage.setItem("last-clicked", `${new Date()}`)
  console.log("changed sessionStorage to", `${new Date()}`);
  
}