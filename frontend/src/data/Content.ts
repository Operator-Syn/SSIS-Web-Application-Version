import type { FC } from "react";

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
    { name: "Student Data Information", path: "/student-information", component: null },
    { name: "Enrollment Forms", path: "/forms", component: null },
    { name: "College Management", path: "/management", component: null },
];
