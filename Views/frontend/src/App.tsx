import { Routes, Route } from "react-router-dom";
import { Fragment } from 'react';
import NavBar from "./components/navBar/NavBar";
import { navLinks as NavLinks} from "./data/Content";
import "./App.css";

export default function App() {
  return (
    <Fragment>
      <NavBar />
      <Routes>
        {NavLinks.map((link) => {
          const Component = link.component;
          return (
            <Route
              key={link.path}
              path={link.path}
              element={Component ? <Component /> : null}
            />
          );
        })}
      </Routes>

    </Fragment>

  );
}
