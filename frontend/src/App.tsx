import { Routes, Route } from "react-router-dom";
import { Fragment } from 'react';
import NavBar from "./components/navBar/NavBar";
import { navLinks as NavLinks, brandName as BrandName } from "./data/Content";
import WorkingArea from "./components/WorkingArea";
import "./App.css";

export default function App() {
  return (
    <Fragment>
      <NavBar brandName={BrandName} links={NavLinks} />
      <Routes>
        {NavLinks.map((link) => (
          <Route
            key={link.path}
            path={link.path}
            element={
              <WorkingArea>
                {link.component && <link.component />}
              </WorkingArea>
            }
          />
        ))}
      </Routes>
    </Fragment>

  );
}
