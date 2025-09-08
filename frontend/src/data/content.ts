import type { FC } from "react";

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
    { name: "Home", path: "/", component: null },
    { name: "Projects", path: "/projects", component: null },
    { name: "Certificates", path: "/certs", component: null },
    { name: "Snippets", path: "/snippets", component: null },
];
