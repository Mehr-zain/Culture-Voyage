import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { HambergerMenu, CloseCircle, Notification } from "iconsax-react";
import UserDark from "../../assets/userBlack.png";
import UserLight from "../../assets/userWhite.png";
import { UserContext } from "../../context/AuthContext";
import { getUserData } from "../../utils/Firebase Utils Functions";

import SideBarComponent from "../SideBar/SideBar.component";
import { Colors } from "../../constants/Colors";
import { AppRoutes } from "../../constants/AppRoutes";
import { SearchInput } from "../SearchInput/SearchInput";
export default function Navbar() {
  const { user } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const data = await getUserData(user.uid);
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex items-center justify-between py-2 ">
      <div className="flex items-center lg:order-none md:order-last ">
        <h2 className="ml-3 bg-gradient-to-r font-[teko]  from-blAccent from-10% via-sky-500 via-30% to-accent to-90% text-transparent bg-clip-text font-bold md:text-3xl text-2xl ">
          Culture Voyage
        </h2>
      </div>
      <div
        className="lg:hidden block"
        onClick={() => setToggleSidebar(!toggleSidebar)}
      >
        <HambergerMenu size="32" className="dark:text-primary text-secondary" />
      </div>
      <div className="w-[60%] md:block hidden">
        <SearchInput value={search} setValue={setSearch} />
      </div>

      <div className="items-center   lg:flex hidden gap-4">
        {/* <div className="w-[300px]">
          <InputField type="text" placeholder="Search" value={search} setValue={setSearch}>
            <SearchNormal className={"dark:text-primary text-textPrimary"} />
          </InputField>
        </div> */}
        <div className="w-[100px] flex items-center justify-center gap-2">
          {/* <Button onClickHandler={signout}>Logout</Button> */}
          {/* <CreateCommunity /> */}
        </div>
        <Link className="flex items-center justify-center gap-6" to={`${AppRoutes.profile.baseRoute}/${user?.uid}`}>
          <div className="tooltip tooltip-bottom" data-tip="notifications">
            <div className="avatar indicator">
              <span className="indicator-item badge text-primary border-none bg-darkCardBg">12</span>
              <Notification size="30" color="gray" className="" />
            </div>
          </div>
          <div className="dark:hidden block">
            <img
              style={{ width: 50, height: 50 }}
              src={userData?.Avatar || UserDark}
              alt="Profile"
              className="rounded-full object-cover cursor-pointer"
            />
          </div>
          <div className="hidden dark:block">
            <img
              style={{ width: 50, height: 50 }}
              src={userData?.Avatar || UserLight}
              alt="Profile"
              className="rounded-full object-cover cursor-pointer"
            />
          </div>

        </Link>
      </div>

      {/* Sidebar for mobile breakpoint */}
      {toggleSidebar && (
        <div className="z-50 h-[100vh] animate-slide-in lg:hidden fixed gap-4 dark:bg-blue-darkmd bg-blue-lightmd right-0 transition-all duration-300 ease-in-out top-0 w-4/5 f-full bg-primary dark:bg-secondary overflow-hidden shadow-md">
          <div className="flex justify-end items-center p-8">
            <CloseCircle onClick={() => setToggleSidebar(!toggleSidebar)} size="32" color={Colors.warning} />
          </div>
          <SideBarComponent />
        </div>
      )}
    </div>
  );
}
