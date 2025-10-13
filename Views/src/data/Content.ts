import type { FC } from "react";
import { createElement } from "react";
import StudentData from "../components/pages/studentDataPage/StudentDataPage";
import EnrollmentForms from "../components/pages/enrollmentFormsPage/EnrollmentFormPage";
import UpdateEnrollment from "../components/pages/enrollmentFormsPage/UpdateFormPage"
import ManagementPage from "../components/pages/managementPage/ManagementPage";
import LogoImage from "../assets/Logo.png";
import { createColumnHelper } from "@tanstack/react-table";

export const brandName = "Lupinbridge Student Information System";

// ---------- Navbar Types & Config ----------
export interface NavBarBrandProps {
    logoSrc?: string;
    logoAlt?: string;
    onClick?: () => void;
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
    component?: FC | null;
}

// Visible in navbar
export const navLinks: NavLinkItem[] = [
    { name: "Homepage", path: "/", component: null },
    { name: "Student Data Information", path: "/student-information", component: StudentData },
    { name: "Enrollment Forms", path: "/forms", component: EnrollmentForms },
    { name: "Management", path: "/management", component: ManagementPage },
];

// Hidden routes (not in navbar)
export const hiddenRoutes: NavLinkItem[] = [
    { name: "Update Forms", path: "/forms/update", component: UpdateEnrollment },
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
    const year = 2023 + (i % 3);
    const name = sampleNames[i % sampleNames.length];
    const program = sampleCourses[i % sampleCourses.length];
    const yearLevel = (i % 4) + 1;
    const gender = i % 2 === 0 ? "Male" : "Female";
    const collegeName = "College of Computer Studies";

    return {
        id: generateId(year, i + 1),
        firstName: name.firstName,
        middleName: Math.random() < 0.95
            ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
            : undefined,
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
        header: "ID Number",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("lastName", {
        header: "Last Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    columnHelper.accessor("middleName", {
        header: "Middle Initial",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue() ?? "-"),
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

// ---------- Data Page Dropdown Options ----------
export const sortByOptions = [
    { label: "Ascending", onClick: () => console.log("Ascending clicked now sending SQL Query through Flask") },
    { label: "Descending", onClick: () => console.log("Descending clicked now sending SQL Query through Flask") },
];
