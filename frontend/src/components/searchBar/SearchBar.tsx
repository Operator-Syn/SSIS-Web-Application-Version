import './SearchBar.css';

export default function SearchBar() {
    return (
        <div className="search-bar">
            <i className="bi bi-search search-icon"></i>
            <input
                className="form-control"
                list="datalistOptions"
                id="exampleDataList"
                placeholder="Type to search..."
            />
            <datalist id="datalistOptions">
                {/* options */}
            </datalist>
        </div>
    );
}
