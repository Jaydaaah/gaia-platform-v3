import Button from "@/Components/Button/Button";
import { router, useForm } from "@inertiajs/react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

export default function DashboardUpload() {
    const [file, setFile] = useState<File | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (file) {
            const formData = new FormData();
            formData.append("upload", file);

            console.log("Uploading file:", file.name);

            router.post(route("file-upload.store"), formData, {
                onSuccess: () => {
                    setFile(null); // Reset state
                    if (fileRef.current) {
                        fileRef.current.value = ""; // Clear input field
                    }
                },
            });
        }
    }, [file]);

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
