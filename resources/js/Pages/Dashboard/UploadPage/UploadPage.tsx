import ModalLayout from "@/Layouts/ModalLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { UploadPage as UploadPageType } from "./types";
import FieldSetLabel from "@/Components/FieldSet/FieldSetLabel";
import Field from "@/Components/FieldSet/Field";
import FieldSetLegend from "@/Components/FieldSet/FieldSetLegend";
import Button from "@/Components/Button/Button";
import { FormEvent, useCallback } from "react";
import FieldArea from "@/Components/FieldSet/FieldArea";
import Loading from "@/Components/Loading/Loading";

export default function UploadPage() {
    const {
        props: { folder_id, context_id, filename },
    } = usePage<UploadPageType>();

    const { data, setData, processing, errors, patch } = useForm({
        folder_id,
        name: filename ?? "",
        subject: "",
        description: "",
    });

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            patch(route("file-upload.update", context_id));
        },
        [context_id, patch]
    );

    const onReset = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            setData({
                folder_id: null,
                name: filename,
                subject: "",
                description: "",
            });
            window.history.back();
            router.delete(route("file-upload.destroy", context_id));
        },
        [context_id]
    );

    return (
        <ModalLayout>
            <form
                className="flex flex-col"
                onSubmit={onSubmit}
                onReset={onReset}
            >
                <div>
                    <FieldSetLegend>Filename</FieldSetLegend>
                    <Field className="w-full" value={filename} readOnly />
                </div>
                <div>
                    <FieldSetLegend>Discussion Name</FieldSetLegend>
                    <Field
                        className="w-full"
                        value={data.name}
                        onChange={({ target }) => setData("name", target.value)}
                    />
                    <FieldSetLabel className="text-error">
                        {errors.name}
                    </FieldSetLabel>
                </div>
                <div>
                    <FieldSetLegend>Subject</FieldSetLegend>
                    <Field
                        className="w-full"
                        value={data.subject}
                        onChange={({ target }) =>
                            setData("subject", target.value)
                        }
                    />
                    <FieldSetLabel className="text-error">
                        {errors.subject}
                    </FieldSetLabel>
                </div>
                <div>
                    <FieldSetLegend>Description</FieldSetLegend>
                    <FieldArea
                        minLength={3}
                        className="w-full"
                        value={data.description}
                        onChange={({ target }) =>
                            setData("description", target.value)
                        }
                    />
                    <FieldSetLabel className="text-error">
                        {errors.description}
                    </FieldSetLabel>
                </div>
                <footer className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? <Loading /> : "Submit"}
                    </Button>
                    <button type="reset">Cancel</button>
                </footer>
            </form>
        </ModalLayout>
    );
}
