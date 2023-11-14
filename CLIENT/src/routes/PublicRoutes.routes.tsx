import { Routes, Route } from "react-router-dom"
import HomePages from "../components/MovieCard"
import { FC } from "react"


const RoutesComponent: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePages />}  />
    </Routes>
  )

}

export default RoutesComponent