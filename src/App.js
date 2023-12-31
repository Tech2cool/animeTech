import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Search, Popular, Video, AnimeDetails, Navbar, NavbarBottom, Genre, NewSeason } from "./components";
import { LanguageProvider } from './context/langContext';

import './App.css';

function App() {
  return (
    <BrowserRouter>
    <LanguageProvider>
      <Navbar />
      <Routes>
        <Route path='//:page?' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/video/:episodeID/:episodeNum/:animeTitle?/:animeID?' element={<Video />} />
        <Route path='/anime-details/:animeID' element={<AnimeDetails />} />
        <Route path='/popular/:page?' element={<Popular />} />
        <Route path='/new-season/:page?' element={<NewSeason />} />
        <Route path='/genre/:genre' element={<Genre />} />
      </Routes>
      <NavbarBottom />
    </LanguageProvider>
    </BrowserRouter>

    // <Loading/>
  );
}

export default App;
