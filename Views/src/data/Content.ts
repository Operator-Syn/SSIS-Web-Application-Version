import type { FC } from "react";
import { createElement } from "react";
import StudentData from "../components/pages/studentDataPage/StudentDataPage";
import CollegeTable from "../components/pages/managementPage/collegeTable/CollegeTable";
import ProgramTable from "../components/pages/managementPage/programTable/ProgramTable";
import LoginPage from "../components/loginPage/login"
import HomePage from "../components/pages/homePage/homepage";
import { supabase } from "../lib/supabaseClient";

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

export interface NavLinkItem {
    name: string;
    path: string;
    component?: FC | null;
}

export const navLinks: NavLinkItem[] = [
    { name: "Homepage", path: "/", component: HomePage },
    { name: "Student Information", path: "/student/information", component: StudentData },
    { name: "College Information", path: "/colleges", component: CollegeTable },
    { name: "Program Information", path: "/programs", component: ProgramTable },
];

export const hiddenRoutes: NavLinkItem[] = [
    { name: "Login", path: "/login", component: LoginPage}
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
    imagePath?: string | null;
}

// ---------- Student Table Columns ----------
const studentColumnHelper = createColumnHelper<Student>();

export const getStudentColumns = (onUpdate: (id: string) => void) => [
    studentColumnHelper.accessor("imagePath", {
        header: "Photo",
        cell: (info) => {
            const path = info.getValue();
            if (!path) return createElement("p", { className: "m-0 p-2 text-center text-muted" }, "-");
            const { data } = supabase.storage.from("profile").getPublicUrl(path);
            return createElement(
                "div",
                { className: "d-flex justify-content-center align-items-center" },
                createElement("img", {
                    src: data.publicUrl,
                    className: "rounded-circle",
                    style: { width: "80px", height: "80px", objectFit: "cover" },
                    alt: "Profile photo",
                })
            );
        },
    }),
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
    studentColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
            const student = info.row.original;
            return createElement(
                "div",
                { className: "d-flex gap-2 justify-content-center" },
                createElement("button", { 
                    className: "btn btn-sm btn-primary", 
                    onClick: () => onUpdate(student.id) 
                }, "Update")
            );
        }
    })
];

// ---------- Program Data Types ----------
export interface Program {
    programName: string;
    programCode: string;
    collegeName: string;
}

const programColumnHelper = createColumnHelper<Program>();

// CHANGED: Now a function that accepts onUpdate and returns columns
export const getProgramColumns = (onUpdate: (code: string) => void) => [
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
    // Added Actions column
    programColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
            const program = info.row.original;
            return createElement(
                "div",
                { className: "d-flex gap-2 justify-content-start" },
                createElement("button", { 
                    className: "btn btn-sm btn-primary", 
                    onClick: () => onUpdate(program.programCode) 
                }, "Update")
            );
        }
    })
];

// ---------- College Data Types ----------
export interface College {
    collegeName: string;
    collegeCode: string;
}

// ---------- College Table Columns ----------
const collegeColumnHelper = createColumnHelper<College>();

export const getCollegeColumns = (onUpdate: (code: string) => void) => [
    collegeColumnHelper.accessor("collegeName", {
        header: "College Name",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    collegeColumnHelper.accessor("collegeCode", {
        header: "College Code",
        cell: (info) => createElement("p", { className: "m-0 p-2" }, info.getValue()),
    }),
    collegeColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
            const college = info.row.original;
            return createElement(
                "div",
                { className: "d-flex gap-2 justify-content-start" },
                createElement("button", { 
                    className: "btn btn-sm btn-primary", 
                    onClick: () => onUpdate(college.collegeCode) 
                }, "Update")
            );
        }
    })
];

// ---------- Data Page Dropdown Options ----------
export const sortByOptions = [
    { label: "Ascending", value: "ASC"},
    { label: "Descending", value: "DESC" },
];