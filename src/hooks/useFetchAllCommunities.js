import { useState } from 'react'
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Firebase.js";
import { CommunityDto } from "../dto/CommunityDto.js";
import { useEffect } from 'react';
export const useFetchAllCommunities = (userId) => {
    const [communities, setCommunities] = useState([]);
    const [isFetchingCommunities, setIsFetchingCommunities] = useState(true);
    useEffect(() => {
        let unsub = onSnapshot(collection(db, 'Communities'), (snapshots) => {
            const temp = []
            snapshots.forEach(snapshot => {
                const communityData = snapshot.data()
                if (communityData['Created By'] !== userId) {
                    const community_dto = new CommunityDto(communityData)
                    temp.push({ id: snapshot.id, ...community_dto });
                }
            })
            setCommunities(temp)
            setIsFetchingCommunities(false)
        })
        return () => unsub()
    }, [userId])
    return { communities, isFetchingCommunities }
}