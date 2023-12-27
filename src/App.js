import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Home, Search, Loading,Popular ,Video, AnimeDetails, Navbar, NavbarBottom} from "./components";

import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='//:page?' element={<Home />}/>
      <Route path='/search' element={<Search />}/>
      <Route path='/video/:episodeID/:episodeNum/:animeTitle?/:animeID?' element={<Video />}/>
      <Route path='/anime-details/:animeID' element={<AnimeDetails />}/>
      <Route path='/popular/:page?' element={<Popular />}/>
      <Route path='/anime-list/:page?' element={<Popular />}/>
    </Routes>
    <NavbarBottom />
    </BrowserRouter>
    // <Loading/>
  );
}

export default App;
