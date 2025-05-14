import { useForm, usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";
import { FormEvent, useCallback, useEffect, useMemo, useRef } from "react";
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
                className="
                w-full h-full overflow-y-scroll resize-none
                p-4 pt-2
                font-mono text-base-content text-sm leading-relaxed
                bg-base-100 shadow-inner
                border-l-4 border-b-0 border-neutral-500 border-dashed
                rounded-t-box rounded-none
                focus:ring-0 focus:outline-none
                [background-image:repeating-linear-gradient(var(--color-base-100),var(--color-base-100)_23px,var(--color-base-300)_24px)]
                "
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
