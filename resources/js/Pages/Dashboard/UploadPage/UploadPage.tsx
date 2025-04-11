import ModalLayout from "@/Layouts/ModalLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { UploadPage as UploadPageType } from "./types";
import FieldSetLabel from "@/Components/FieldSet/FieldSetLabel";
import Field from "@/Components/FieldSet/Field";
import FieldSetLegend from "@/Components/FieldSet/FieldSetLegend";
import Button from "@/Components/Button/Button";
import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import FieldArea from "@/Components/FieldSet/FieldArea";
import Loading from "@/Components/Loading/Loading";
import BotAvatar from "@/Components/Avatar/BotAvatar";
import Modal from "@/Components/Modal/Modal";
import ModalBox from "@/Components/Modal/ModalBox";

export default function UploadPage() {
    const modalRef = useRef<HTMLDialogElement>(null);

    const {
        props: { folder_id, context, filename },
    } = usePage<UploadPageType>();

    const { data, setData, processing, errors, patch } = useForm({
        folder_id,
        bot_name: "",
        name: filename ?? "",
        subject: "",
        description: "",
    });

    const [botName, setBotName] = useState("");

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            patch(route("file-upload.update", context.id));
        },
        [context, patch]
    );

    const onReset = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            setData({
                folder_id: null,
                name: filename,
                bot_name: "",
                subject: "",
                description: "",
            });
            window.history.back();
            router.delete(route("file-upload.destroy", context.id));
        },
        [context]
    );

    console.log("context: ", context.instruction);

    return (
        <ModalLayout>
            <form
                className="flex flex-col"
                onSubmit={onSubmit}
                onReset={onReset}
            >
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <FieldSetLegend>Filename</FieldSetLegend>
                        <Field className="w-full" value={filename} readOnly />
                    </div>
                    <div className="w-1/2">
                        <FieldSetLegend>Discussion Name</FieldSetLegend>
                        <Field
                            className="w-full"
                            value={data.name}
                            onChange={({ target }) =>
                                setData("name", target.value)
                            }
                        />
                        <FieldSetLabel className="text-error">
                            {errors.name}
                        </FieldSetLabel>
                    </div>
                </div>
                <br />
                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-neutral">
                        <BotAvatar
                            className="w-16 md:w-32"
                            name={botName.length ? botName : "Sara"}
                        />
                    </div>
                    <FieldSetLegend>Bot Name</FieldSetLegend>
                    <Field
                        className="max-w-sm text-center"
                        value={data.bot_name}
                        onChange={({ target }) =>
                            setData("bot_name", target.value)
                        }
                        onBlur={({ target }) => setBotName(target.value)}
                    />
                    <FieldSetLabel className="text-error">
                        {errors.bot_name}
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
                        className="w-full min-h-24"
                        value={data.description}
                        onChange={({ target }) =>
                            setData("description", target.value)
                        }
                    />
                    <FieldSetLabel className="text-error">
                        {errors.description}
                    </FieldSetLabel>
                </div>

                <div>
                    <FieldSetLegend>Generated Instruction</FieldSetLegend>
                    <Button
                        type="button"
                        onClick={() => modalRef.current?.showModal()}
                    >
                        View Code
                    </Button>
                    <Modal _ref={modalRef}>
                        <div className="modal-box mockup-code w-full max-w-5xl h-[50vh] overflow-y-auto">
                            {context.instruction.split("\n").map((line) => (
                                <pre>
                                    <code>{line}</code>
                                </pre>
                            ))}
                        </div>
                    </Modal>
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
