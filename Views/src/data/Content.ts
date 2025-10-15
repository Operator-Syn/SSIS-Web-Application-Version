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
    { name: "Student Data Information", path: "/student/information", component: StudentData },
    { name: "Enrollment Forms", path: "/student/enroll", component: EnrollmentForms },
    { name: "Management", path: "/management", component: ManagementPage },
];

// Hidden routes (not in navbar)
export const hiddenRoutes: NavLinkItem[] = [
    { name: "Update Forms", path: "/student/update", component: UpdateEnrollment },
];

// ---------- Student Data Types ----------
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

// ---------- Student Table Columns ----------
const studentColumnHelper = createColumnHelper<Student>();

export const studentColumns = [
    studentColumnHelper.accessor("id", {
        header: "ID Number",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    studentColumnHelper.accessor("lastName", {
        header: "Last Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    studentColumnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    studentColumnHelper.accessor("middleName", {
        header: "Middle Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue() ?? "-"),
    }),
    studentColumnHelper.accessor("gender", {
        header: "Gender",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    studentColumnHelper.accessor("yearLevel", {
        header: "Year Level",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    studentColumnHelper.accessor("collegeName", {
        header: "College Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    studentColumnHelper.accessor("program", {
        header: "Program",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
];

// ---------- Program Data Types ----------
export interface Program {
    programName: string;
    programCode: string;
    collegeName: string;
}

// ---------- Program Table Columns ----------
const programColumnHelper = createColumnHelper<Program>();

export const programColumns = [
    programColumnHelper.accessor("programName", {
        header: "Program Name",
        cell: (info) => createElement("p", {className: "m-0 p-2"}, info.getValue()),
    }),
    programColumnHelper.accessor("programCode", {
        header: "Program Code",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    programColumnHelper.accessor("collegeName", {
        header: "College Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
]

// ---------- College Data Types ----------
export interface College {
    collegeName: string;
    collegeCode: string;
}

// ---------- College Table Columns ----------
const collegeColumnHelper = createColumnHelper<College>();

export const collegeColumns = [
    collegeColumnHelper.accessor("collegeName", {
        header: "College Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    collegeColumnHelper.accessor("collegeCode", {
        header: "College Code",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
]

// ---------- Data Page Dropdown Options ----------
export const sortByOptions = [
    { label: "Ascending", value: "ASC"},
    { label: "Descending", value: "DESC" },
];
