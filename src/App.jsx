

import RoutesContainer from "./pages/Routes/RoutesContainer"
import { ThemeController } from "./components/DaktToggler/DarkToggler"
import { useState } from 'react'
import './App.css'
export default function App() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [darkMode, setDarkMode] = useState(false)
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <ThemeController darkMode={darkMode} setDarkMode={setDarkMode} />
      <RoutesContainer />
    </div>
  )
}
