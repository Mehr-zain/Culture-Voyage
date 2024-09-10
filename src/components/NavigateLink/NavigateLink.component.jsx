
import { Link } from "react-router-dom"
// eslint-disable-next-line react/prop-types
export default function NavigateLink({ children, toURL, data = null }) {
    return <Link to={toURL} state={data ?? ""} className="dark:text-accent text-blAccent hover:underline font-bold ">
        {children}
    </Link >

}
