import { type ReactNode } from 'react';
import "./WorkingArea.css";

interface WokringAreaProps {
    children?: ReactNode;
}

export default function WorkingArea({ children }: WokringAreaProps) {
    return (
        <div id="wrapper">
            <div id="workingArea" className="d-flex">
                {children}
            </div>
        </div>
    )
}