import Dropdown from 'react-bootstrap/Dropdown';

interface DropdownItem {
    label: string;
    onClick?: () => void;
}

interface TableDropdownProps {
    buttonText: string;
    items: DropdownItem[];
}

export default function TableDropdown({ buttonText, items }: TableDropdownProps) {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {buttonText}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {items.map((item, idx) => (
                    <Dropdown.Item key={idx} onClick={item.onClick}>
                        {item.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}