import "./App.css";
import NavBar from "./components/navBar/NavBar";
import { navLinks, brandName } from "./data/Content";

export default function App() {
  return (
    <NavBar brandName={brandName} links={navLinks} />
  );
}
