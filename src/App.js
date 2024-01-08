import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Search, Popular, Video, AnimeDetails, Navbar, NavbarBottom, Genre, NewSeason, NotFound, Loading } from "./components";
import { LanguageProvider } from './context/langContext';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Navbar />
        <Routes>
          <Route path='/:page?' element={
            <Suspense fallback={<Loading LoadingType={"HashLoader"} color={"red"} />}>
              <Home />
            </Suspense>
          } />
          <Route path='/search/:qTitle?/:qPage?' element={
            <Suspense fallback={<Loading LoadingType={"HashLoader"} color={"red"} />}>
              <Search />
            </Suspense>
          } />
          <Route path='/video/:episodeID/:episodeNum/:animeTitle?/:animeID?' element={
            <Suspense fallback={<Loading LoadingType={"HashLoader"} color={"red"} />}>
              <Video />
            </Suspense>
          } />
          <Route path='/anime-details/:animeID' element={
            <Suspense fallback={<Loading LoadingType={"HashLoader"} color={"red"} />}>
              <AnimeDetails />
            </Suspense>
          } />
          <Route path='/popular/:page?' element={
            <Suspense fallback={<Loading LoadingType={"HashLoader"} color={"red"} />}>
              <Popular />
            </Suspense>
          } />
          <Route path='/new-season/:page?' element={
            <Suspense fallback={<Loading LoadingType={"HashLoader"} color={"red"} />}>
              <NewSeason />
            </Suspense>
          } />
          <Route path='/genre/:genre/:page?' element={
            <Suspense fallback={<Loading LoadingType={"HashLoader"} color={"red"} />}>
              <Genre />
            </Suspense>
          } />
          <Route path='*' element={
            <Suspense fallback={<Loading LoadingType={"HashLoader"} color={"red"} />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
          <NavbarBottom />
      </LanguageProvider>
    </BrowserRouter>

    // <Loading/>
  );
}

export default App;
