import { MdNotes } from "react-icons/md";
import Dropdown from "@/Components/Dropdown/Dropdown";
import DropdownContent from "@/Components/Dropdown/DropdownContent";
import { router, useForm, usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";
import {
    FocusEvent,
    FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Loading from "@/Components/Loading/Loading";

export default function NotesSection() {
    const {
        props: { note, exam_file, read_only },
    } = usePage<ChatPageProps>();

    const formRef = useRef<HTMLFormElement>(null);

    const content = useMemo(() => {
        return note?.content ?? "";
    }, [note]);

    const { id: exam_id } = useMemo(() => {
        return exam_file ?? {};
    }, [exam_file]);

    const { data, setData, processing, errors, post } = useForm({
        content: "",
        exam_id,
    });

    useEffect(() => {
        if (content) {
            setData("content", content);
        }
    }, [content]);

    const hasChanges = useMemo(() => {
        return content != data.content;
    }, [content, data]);

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            post(route("chat.notes.store"));
        },
        [post]
    );

    const error_text = useMemo(() => {
        return errors.exam_id ?? errors.content;
    }, [errors]);

    return (
        <form
            ref={formRef}
            className="w-full h-full absolute"
            onSubmit={onSubmit}
        >
            {read_only && note?.owner.name && (
                <div className="text-sm text-gray-500 px-4 pt-2 pb-1">
                    Notes from{" "}
                    <span className="font-semibold">{note?.owner.name}</span>
                </div>
            )}
            <textarea
                className="w-full h-full focus:ring-0 bg-base-200/50 border-neutral/50 focus:border-neutral focus:bg-base-200/75 text-base-content resize-none rounded-t-box p-4 pt-2"
                onChange={({ target }) => setData("content", target.value)}
                value={data.content}
                onBlur={() => hasChanges && formRef.current?.requestSubmit()}
                readOnly={read_only}
            />
            {processing && (
                <Loading className="loading-xs absolute top-2 right-2" />
            )}
            {error_text ||
                (content == undefined && (
                    <span className="text-xs text-error absolute bottom-2 left-2">
                        {error_text}
                    </span>
                ))}
        </form>
    );
}
