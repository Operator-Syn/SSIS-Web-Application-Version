import { Routes, Route, useLocation, matchRoutes } from "react-router-dom";
import { Fragment } from "react";
import NavBar from "./components/navBar/NavBar";
import { navLinks as NavLinks, hiddenRoutes as HiddenRoutes } from "./data/Content";
import "./App.css";

export default function App() {
  const location = useLocation();

  // Flatten all defined routes
  const allRoutes = [...NavLinks, ...HiddenRoutes].map(link => ({ path: link.path }));

  // Check if current location matches any route
  const matched = matchRoutes(allRoutes, location);

  // Hide NavBar if /login or path does not match any route (i.e., 404)
  const showNavBar = location.pathname !== "/login" && matched;

  return (
    <Fragment>
      {showNavBar && <NavBar />}
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

        {HiddenRoutes.map((link) => {
          const Component = link.component;
          return (
            <Route
              key={link.path}
              path={link.path}
              element={Component ? <Component /> : null}
            />
          );
        })}

        {/* 404 route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Fragment>
  );
}
