import Button from "@/Components/Button/Button";
import { router, useForm, usePage } from "@inertiajs/react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { DashboardPage } from "../types";

export default function DashboardUpload() {
    const {
        props: { folder_id },
    } = usePage<DashboardPage>();

    const [file, setFile] = useState<File | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (file) {
            const formData = new FormData();
            if (folder_id && !isNaN(folder_id)) {
                formData.append("folder_id", `${folder_id}`);
            }
            formData.append("upload", file);

            router.post(route("file-upload.store"), formData, {
                onSuccess: () => {
                    setFile(null); // Reset state
                    if (fileRef.current) {
                        fileRef.current.value = ""; // Clear input field
                    }
                },
            });
        }
    }, [file, folder_id]);

    const onChange = useCallback(
        ({ target }: ChangeEvent<HTMLInputElement>) => {
            if (target.files && target.files.length > 0) {
                const file = target.files[0];
                setFile(file);
            }
        },
        []
    );

    return (
        <>
            <div className="join">
                <Button
                    className="join-item"
                    onClick={() => fileRef.current?.click()}
                >
                    Upload
                </Button>
            </div>
            <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={onChange}
            />
        </>
    );
}
