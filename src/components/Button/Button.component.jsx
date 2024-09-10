
// eslint-disable-next-line react/prop-types
export default function Button({ children, onClickHandler, isDisabled, px = 2, py = 2, outline = false }) {

    return (
        <button
            disabled={isDisabled}
            onClick={onClickHandler}
            className={` w-full  ${outline ? 'dark:text-textPrimary text-textSecondary dark:bg-transparent bg-primary `  border dark:border-borderSecondary ' : 'dark:bg-accent bg-blAccent text-buttonLightTextColor'}  rounded-lg  focus:outline-none focus:shadow-outline-accent px-${px} py-${py} `}
        >
            {children}
        </button>
    )
}
