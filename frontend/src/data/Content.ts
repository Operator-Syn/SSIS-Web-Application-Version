import type { FC } from "react";
import StudentData from "../components/studentDataInformation/StudentData";
import LogoImage from "../assets/Logo.png";
export const brandName = "Lupinbridge Student Information System";


// Logo interface (for type safety)
export interface NavBarBrandProps {
    logoSrc?: string;   // optional
    logoAlt?: string;   // optional
}

// Default logo config (can be empty if no logo)
export const Logo: NavBarBrandProps = {
    logoSrc: LogoImage,
};

export interface NavBarProps {
    brandName: string;
    links: NavLinkItem[];
}

export interface NavLinkItem {
    name: string;
    path: string;
    component?: FC | null; // optional component
}

export const navLinks: NavLinkItem[] = [
    {name: "Homepage", path: "/", component: null},
    { name: "Student Data Information", path: "/student-information", component: StudentData },
    { name: "Enrollment Forms", path: "/forms", component: null },
    { name: "College Management", path: "/management", component: null },
];
