import { collection, documentId, getDocs, query, where } from 'firebase/firestore'
import { useEffect } from 'react'
import { useState } from 'react'
import { db } from '../firebase/Firebase'

export default function useFetchAllCommunityMembers(communityData) {
    const [allCommunityMembers, setAllCommunityMembers] = useState([])
    useEffect(() => {
        const getCommunityMembers = async () => {
            let communityMembersID = []
            communityMembersID = [...communityData['Members'], communityData['Created By']] ?? []
            if (communityMembersID.length > 0) {
                const temp = []
                const snapshot = await getDocs(query(collection(db, 'Users'), where(documentId(), 'in', communityMembersID)))
                snapshot.forEach((member) => {
                    temp.push({ id: member.id, ...member.data() })
                })
                setAllCommunityMembers(temp)
            }
        }
        getCommunityMembers()
    }, [communityData])
    return { allCommunityMembers, setAllCommunityMembers }
}
