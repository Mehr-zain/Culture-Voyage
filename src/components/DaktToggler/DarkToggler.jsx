import { Moon, Sun1 } from 'iconsax-react'

// eslint-disable-next-line react/prop-types
export const ThemeController = ({ darkMode, setDarkMode }) => {
    const toggleTheme = () => {
        setDarkMode(!darkMode)
    }

    return (
        <div className={'dark:bg-darkContainer bg-lightContainer Grey p-2 rounded-lg shadow cursor-pointer fixed bottom-6 left-6'} onClick={toggleTheme}>
            {
                darkMode ? <Sun1
                    size="25"
                    color="white"
                /> : <Moon
                    size="25"
                    color={'black'}
                />

            }

        </div>
    )
}