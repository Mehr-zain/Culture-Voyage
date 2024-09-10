

import { SideBarTab } from "../SideBarTab/SideBarTab.jsx";
import { useContext, useState } from "react";
import { useLocation } from 'react-router-dom'
import { UserContext } from "../../context/AuthContext.jsx";
import pen from '../../assets/sidebar_icons/pen.png'
import home from '../../assets/sidebar_icons/home.png'
import community from '../../assets/sidebar_icons/community.png'
import profile from '../../assets/sidebar_icons/profile.png'
// import { CreateCommunity } from "../CreateCommunity.jsx";
const ICON_WIDTH = 30;
const ICON_HEIGHT = 30;
const SideBarComponent = () => {
    const location = useLocation()
    const { user } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState(location.pathname === '/' ? '/' : location.pathname.slice(1))

    return (
        <>
            <div className="w-full px-2 ">
                <div className="flex flex-col gap-5 relative  ">
                    <SideBarTab activeTab={activeTab} setActiveTab={setActiveTab} label={'Home'} to={'/'}>
                        <img src={home} width={ICON_WIDTH} height={ICON_HEIGHT} className="rounded-full" />

                        {/* <Home variant={activeTab === '/' ? 'Bold' : 'Outline'} /> */}
                    </SideBarTab>

                    {/* <SideBarTab activeTab={activeTab} setActiveTab={setActiveTab} label={'Recommended'} to={'/lkj'}>
                        <Like1 variant={activeTab.includes('recommended') ? 'Bold' : 'Outline'} />
                    </SideBarTab> */}

                    <SideBarTab activeTab={activeTab} setActiveTab={setActiveTab} to='communities' label={'Communities'}>
                        <img src={community} width={ICON_WIDTH} height={ICON_HEIGHT} className="rounded-full" />

                        {/* <People variant={activeTab === 'communities' ? 'Bold' : 'Outline'} /> */}
                    </SideBarTab>
                    <div className="h-[1px] dark:bg-borderSecondary bg-borderPrimary"></div>
                    <SideBarTab activeTab={activeTab} setActiveTab={setActiveTab} label={'Create Post'} to={'create-post'}>
                        <img src={pen} width={ICON_WIDTH} height={ICON_HEIGHT} className="rounded-full" />
                        {/* <AddCircle variant={activeTab === 'create-post' ? 'Bold' : 'Outline'} color="#F1BC19" /> */}
                    </SideBarTab>
                    {/* <SideBarTab activeTab={activeTab} setActiveTab={setActiveTab} label={'Favourites'} to={'sdf'}>
                        <Star />
                    </SideBarTab> */}
                    {/* <CreateCommunity renderButton={true} /> */}

                    <div className="h-[1px] dark:bg-borderSecondary bg-borderPrimary"></div>
                    <SideBarTab activeTab={activeTab} setActiveTab={setActiveTab} label={'Profile'} to={`profile/${user?.uid}`}>
                        {/* <User variant={activeTab === (`profile/${user?.uid}`) ? 'Bold' : 'Outline'} /> */}
                        <img src={profile} width={ICON_WIDTH} height={ICON_HEIGHT} className="rounded-full" />
                    </SideBarTab>
                </div>
            </div>
        </>
    );
}
export default SideBarComponent;