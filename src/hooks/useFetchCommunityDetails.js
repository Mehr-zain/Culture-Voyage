import { useEffect, useState } from "react";
import { db } from "../firebase/Firebase.js";
import { doc, onSnapshot } from "firebase/firestore";
export const useFetchCommunityDetails = (id) => {
    const [CommunityData, setCommunityData] = useState({})
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'Communities', id), async (doc) => {
            setCommunityData({ id, ...doc.data() });
            setIsFetching(false)
        })
        return () => unSub()
    }, [id])
    return { isFetching, CommunityData };
}