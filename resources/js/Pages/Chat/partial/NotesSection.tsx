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
        props: { note, exam_file },
    } = usePage<ChatPageProps>();

    const formRef = useRef<HTMLFormElement>(null);

    const content = useMemo(() => {
        return note?.content;
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
            className="absolute right-10 top-0"
            onSubmit={onSubmit}
        >
            <Dropdown className="dropdown-end">
                <summary className="btn m-1 animate-pulse hover:animate-none">
                    <MdNotes />
                </summary>
                <DropdownContent
                    className="w-96 z-50 bg-base-300 rounded-box p-6"
                    doNotWrap
                >
                    <h2 className="text-xl text-center mb-3">Notes</h2>
                    <div className="relative">
                        <textarea
                            className="w-full focus:ring-0 h-72 bg-base-200 text-base-content"
                            onChange={({ target }) =>
                                setData("content", target.value)
                            }
                            value={data.content}
                            onBlur={() =>
                                hasChanges && formRef.current?.requestSubmit()
                            }
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
                    </div>
                </DropdownContent>
            </Dropdown>
        </form>
    );
}
