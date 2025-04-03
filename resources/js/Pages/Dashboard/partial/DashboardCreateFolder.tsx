import Field from "@/Components/FieldSet/Field";
import ModalAction from "@/Components/Modal/ModalAction";
import FieldSetLabel from "@/Components/FieldSet/FieldSetLabel";
import Button from "@/Components/Button/Button";
import { useForm, usePage } from "@inertiajs/react";
import Loading from "@/Components/Loading/Loading";
import { useCallback } from "react";
import { PageProps } from "@/types";
import { DashboardPage } from "../types";

export default function DashboardCreateFolder({
    dialogRef,
}: {
    dialogRef: React.RefObject<HTMLDialogElement>;
}) {
    const {
        props: { folder_id },
    } = usePage<PageProps<DashboardPage>>();

    const { data, setData, processing, post, errors } = useForm({
        parent_id: folder_id,
        name: "",
    });

    const onSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            post(route("dashboard.store"), {
                onSuccess: () => {
                    dialogRef.current?.close();
                },
                onError: (errors) => {
                    console.error("Validation failed:", errors);
                },
            });
        },
        [post, dialogRef]
    );

    const onReset = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            setData("name", "");
            dialogRef.current?.close();
        },
        [dialogRef]
    );

    return (
        <form onSubmit={onSubmit} onReset={onReset}>
            <FieldSetLabel>Create a New Folder</FieldSetLabel>
            <Field
                type="text"
                placeholder="Folder Name"
                className="input-bordered w-full mt-3"
                value={data.name}
                onChange={({ target }) => setData("name", target.value)}
            />
            {!!errors.name && (
                <FieldSetLabel className="text-danger">
                    {errors.name}
                </FieldSetLabel>
            )}
            <ModalAction>
                <Button type="reset" className="btn-ghost">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="btn-primary"
                    disabled={processing}
                >
                    {!processing ? "Submit" : <Loading />}
                </Button>
            </ModalAction>
        </form>
    );
}
