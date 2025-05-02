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
import Select from "react-select";
import { useSpeech } from "react-text-to-speech"; // Import the useSpeech hook

const allVoices = [
    "Google US English",
    "Google UK English Female",
    "Google UK English Male",
    "Google 日本語",
    "Google 한국의",
    "Microsoft George - English (United Kingdom)",
    "Microsoft Hazel - English (United Kingdom)",
    "Microsoft Susan - English (United Kingdom)",
    "Google Deutsch",
    "Google español",
    "Google français",
    "Google हिन्दी",
    "Google Bahasa Indonesia",
    "Google italiano",
    "Google Nederlands",
    "Google polski",
    "Google português do Brasil",
    "Google русский",
    "Google 普通话（中国大陆）",
    "Google 粤語（香港）",
    "Google 國語（臺灣）",
];

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
        voice: "Google UK English Male", // Default voice set here
    });

    const [botName, setBotName] = useState("");

    const voiceOptions = useMemo(
        () =>
            allVoices.map((voice) => ({
                label: voice,
                value: voice,
            })),
        []
    );

    const { start } = useSpeech({
        text: "This is a test message to check the selected voice.",
        voiceURI: data.voice, // The selected voice from the form
        rate: 0.9, // Adjust the rate
        pitch: 0.8, // Adjust the pitch
    });

    // useCallback for the testVoice function
    const testVoice = useCallback(() => {
        start(); // Start speaking the test text with the selected voice
    }, [start]);

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
                voice: "Google UK English Male", // Reset to default
            });
            window.history.back();
            router.delete(route("file-upload.destroy", context.id));
        },
        [context]
    );

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

                {/* Voice Select Field */}
                <div>
                    <FieldSetLegend>Voice</FieldSetLegend>

                    <div className="flex">
                        <span className="flex-grow text-black">
                            <Select
                                options={voiceOptions}
                                value={voiceOptions.find(
                                    (option) => option.value === data.voice
                                )}
                                onChange={(selectedOption) => {
                                    setData(
                                        "voice",
                                        selectedOption?.value || ""
                                    );
                                }}
                            />
                        </span>

                        <Button type="button" onClick={testVoice}>
                            Test Voice
                        </Button>
                    </div>
                    <FieldSetLabel className="text-error">
                        {errors.voice}
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
                                <pre key={line}>
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
