import type { FC } from "react";
import StudentData from "../components/studentDataInformation/StudentData";

export const brandName = "Lupinbridge Student Information System";

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
