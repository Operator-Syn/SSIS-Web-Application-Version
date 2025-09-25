import type { FC } from "react";
import { createElement } from "react";
import StudentData from "../components/pages/studentDataPage/studentDataPage";
import LogoImage from "../assets/Logo.png";
import { createColumnHelper } from "@tanstack/react-table";

export const brandName = "Lupinbridge Student Information System";

// ---------- Navbar Types & Config ----------
export interface NavBarBrandProps {
    logoSrc?: string;   // optional
    logoAlt?: string;   // optional
}

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
    { name: "Homepage", path: "/", component: null },
    { name: "Student Data Information", path: "/student-information", component: StudentData },
    { name: "Enrollment Forms", path: "/forms", component: null },
    { name: "Management", path: "/management", component: null },
];

// ---------- Student Data Types & Placeholder ----------
export interface Student {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    yearLevel: number;
    collegeName: string;
    program: string;
}

// Function to generate a random ID in format YYYY-XXXX
const generateId = (year: number, index: number) =>
    `${year}-${String(index).padStart(4, "0")}`;

// Placeholder data
const sampleNames = [
    { firstName: "Juan", lastName: "Dela Cruz" },
    { firstName: "Maria", lastName: "Santos" },
    { firstName: "Pedro", lastName: "Reyes" },
];

const sampleCourses = [
    "BS Computer Science",
    "BS Information Technology",
    "BS Software Engineering",
];

export const students: Student[] = Array.from({ length: 10000 }, (_, i) => {
    const year = 2023 + (i % 3); // cycle through 2023, 2024, 2025
    const name = sampleNames[i % sampleNames.length];
    const program = sampleCourses[i % sampleCourses.length];
    const yearLevel = (i % 4) + 1; // year level 1-4
    const gender = i % 2 === 0 ? "Male" : "Female"; // simple alternation
    const collegeName = "College of Computer Stues";

    return {
        id: generateId(year, i + 1), // ensures unique id
        firstName: name.firstName,
        middleName: Math.random() < 0.95 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : undefined, // optional middle name
        lastName: name.lastName,
        gender,
        yearLevel,
        collegeName,
        program,
    };
});


// ---------- Student Table Columns ----------
const columnHelper = createColumnHelper<Student>();

export const studentColumns = [
    columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("middleName", {
        header: "Middle Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue() ?? "-"),
    }),
    columnHelper.accessor("lastName", {
        header: "Last Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("gender", {
        header: "Gender",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("yearLevel", {
        header: "Year Level",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("collegeName", {
        header: "College Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("program", {
        header: "Program",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
];
