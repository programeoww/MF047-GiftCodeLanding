import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import InitialData from "../interfaces/initialData";

function useFirebase(firebaseConfig: InitialData["firebaseConfig"]) {

  const firebase = initializeApp(firebaseConfig);
  const auth = getAuth(firebase);
  // auth.settings.appVerificationDisabledForTesting = true;

  return {firebase, auth}
}

export default useFirebase;