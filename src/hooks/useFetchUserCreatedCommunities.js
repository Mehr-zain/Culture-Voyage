import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/Firebase.js";
import { getUserData } from "../utils/Firebase Utils Functions/index.js";
import { useEffect, useState } from 'react'
import { CommunityDto } from "../dto/CommunityDto.js";
export const useFetchUserCreatedCommunities = (userId) => {
    const [userCreatedCommunities, setUserCreatedCommunities] = useState([]);
    const [isFetchingUserCreatedCommunities, setIsFetchingUserCreatedCommunities] = useState(true);

    useEffect(() => {

        (async () => {
            const userCreatedCommunitiesIds = await getUserData(userId, 'User Created Communities') ?? [];
            if (userCreatedCommunitiesIds.length == 0) {
                setIsFetchingUserCreatedCommunities(false)
                return;
            }
            onSnapshot(query(collection(db, 'Communities'), where(documentId(), 'in', userCreatedCommunitiesIds)), async (snapshots) => {
                let userCreatedCommunities = []
                snapshots?.forEach(doc => {
                    const communityData = doc.data();
                    const community_dto = new CommunityDto(communityData)
                    userCreatedCommunities.push({ id: doc.id, ...community_dto });
                })
                setUserCreatedCommunities(userCreatedCommunities)
                setIsFetchingUserCreatedCommunities(false)
            })
        })()

    }, [userId])
    return { userCreatedCommunities, isFetchingUserCreatedCommunities }
}