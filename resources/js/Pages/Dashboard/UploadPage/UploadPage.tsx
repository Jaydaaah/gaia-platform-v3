import ModalLayout from "@/Layouts/ModalLayout";
import { usePage } from "@inertiajs/react";
import { UploadPage as UploadPageType } from "./types";

export default function UploadPage() {
    const { props } = usePage<UploadPageType>();

    console.log("path: ", props.path);

    return <ModalLayout>test</ModalLayout>;
}
