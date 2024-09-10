

// eslint-disable-next-line react/prop-types
export default function SocialMediaButton({ children, onClickHandler }) {
    return (
        <div onClick={onClickHandler} className='w-14 h-14 rounded-full border-2 mx-auto mt-2  flex flex-col items-center justify-center'>
            {children}
        </div>
    )
}
