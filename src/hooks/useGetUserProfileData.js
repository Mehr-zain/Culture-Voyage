import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Firebase";

export const useGetUserProfileData = (id) => {

  const [userData, setUserData] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let unsub = onSnapshot(doc(db, 'Users', id), snapshot => {
      const data = snapshot.data()
      setUserData(data)
      setIsFetching(false)
      localStorage.setItem('userDetails', JSON.stringify(data))
    })
    return () => unsub()
  }, [id])
  return {

    isFetching,
    userData,
  };
};
