import { Routes, Route } from "react-router-dom"
import HomePages from "../components/MovieCard"
import { FC } from "react"
import ProfilePage from "../pages/ProfilePage"
import PrivateRoutes from "./PrivateRoutes.routes"
import WatchListPage from "../pages/WatchListPage"
import LandingPage from "../pages/LandingPage"

const RoutesComponent: FC = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/home' element={<HomePages />}  />
      <Route path='/movie/:movieId' element={<HomePages />} />'
       <Route path='/*' element={
        <PrivateRoutes>
          <Routes>
            <Route path='/user/profile' element={<ProfilePage  />} />
            <Route path='/user/watchlist' element={<WatchListPage  />} /> 
          </Routes>
        </PrivateRoutes>
      } />        
    </Routes>
  )
}

export default RoutesComponent