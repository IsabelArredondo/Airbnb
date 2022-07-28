// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignUpFormPage from "./components/SignUpFormPage";
import Spots from './components/Spots'
import SpotById from './components/SpotById'
import CreateArea from './components/CreateSpot'
import UserSpots from "./components/UserSpots";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import EditSpot from "./components/EditSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/signup">
            <SignUpFormPage />
          </Route>

          <Route exact path="/">
            <Spots />
          </Route>
          
          <Route path="/spots/:spotId">
            <SpotById />
          </Route>

          <Route exact path="/spot/createSpot">
            <CreateArea />
          </Route>

          <Route exact path="/user/spots">
            <UserSpots />
          </Route>

          <Route exact path="/edit/userSpot/:id">
            <EditSpot />
          </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
