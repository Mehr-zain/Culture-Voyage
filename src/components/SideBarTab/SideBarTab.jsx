/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const SideBarTab = ({ children, label, to, activeTab, setActiveTab }) => {

    return (
        <Link
            onClick={() => setActiveTab(to)}
            to={to}
            className={`dark:text-textPrimary  text-textSecondary rounded-xl font-bold    p-3 flex items-center justify-start gap-1  ${(activeTab.toLowerCase() === to.toLowerCase()) ? 'dark:accent dark:bg-accent bg-blAccent text-white' : 'dark:hover:bg-darkerGrey hover:bg-softGrey hover:text-textSecondary dark:hover:text-textPrimary'
                } `}
        >
            {children}
            <h2 className="text-md">{label}</h2>
        </Link>
    );
};

export { SideBarTab };
