import Button from "../Button/Button";

interface ToolPanelProps {
    createOnClick: () => void;
    deleteOnClick: () => void;
}
export default function ToolPanel({
    createOnClick,
    deleteOnClick,
}: ToolPanelProps) {
    return (
        <div className="join">
            <Button className="join-item" onClick={createOnClick}>
                Create Folder
            </Button>
            <Button className="join-item" onClick={deleteOnClick}>
                Delete Folder
            </Button>
        </div>
    );
}
