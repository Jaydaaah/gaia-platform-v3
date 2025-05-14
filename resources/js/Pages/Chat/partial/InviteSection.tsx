import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Dropdown from "@/Components/Dropdown/Dropdown";
import DropdownContent from "@/Components/Dropdown/DropdownContent";
import { usePage, router, useForm } from "@inertiajs/react";
import { MdGroupAdd } from "react-icons/md";
import { ChatPageProps } from "../types";
import Loading from "@/Components/Loading/Loading";
import Select from "react-select";
import Avatar from "@/Components/Avatar/Avatar";
import Button from "@/Components/Button/Button";
import { FaLink } from "react-icons/fa";

type OptionType = {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    label: string;
    value: number;
};

export default function InviteSection() {
    const {
        props: { exam_file, other_users },
    } = usePage<ChatPageProps>();

    const [copied, setCopied] = useState(false);

    const shareLink = route("chat.show", exam_file.id);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const initialUserIds = useMemo(() => {
        const { shareable } = exam_file;
        if (Array.isArray(shareable)) {
            return shareable.map(({ id }) => id);
        }
        return [];
    }, [exam_file]);

    const { data, setData, processing, errors, patch } = useForm({
        user_ids: initialUserIds,
    });

    const selectOptions: OptionType[] = useMemo(() => {
        if (Array.isArray(other_users)) {
            return other_users.map((user) => ({
                label: user.name,
                value: user.id,
                ...user,
            }));
        }
        return [];
    }, [other_users]);

    const selectValue = useMemo(() => {
        const { user_ids } = data;
        const selected = selectOptions.filter(({ value }) =>
            user_ids.includes(value)
        );
        return selected;
    }, [selectOptions, data.user_ids]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(initialUserIds) != JSON.stringify(data.user_ids);
    }, [initialUserIds, data]);

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            patch(route("chat.share.update", exam_file.id));
        },
        [patch, exam_file]
    );

    return (
        <form onSubmit={onSubmit}>
            <Dropdown className="dropdown-end">
                <summary className="btn m-1 hover:animate-none">
                    <MdGroupAdd />
                </summary>
                <DropdownContent
                    className="w-96 z-50 bg-base-300 rounded-box p-6"
                    doNotWrap
                >
                    <h2 className="text-xl text-center mb-3">
                        Shared Participants
                    </h2>

                    <div className="mb-3">
                        <div className="flex items-center justify-between bg-base-100 px-3 py-2 rounded border text-sm">
                            <span className="truncate text-gray-500">
                                {shareLink}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="ml-2 text-primary hover:text-primary/80"
                                title="Copy link"
                            >
                                <FaLink />
                            </button>
                        </div>
                        {copied && (
                            <div className="text-xs text-success mt-1 text-center">
                                Copied!
                            </div>
                        )}
                    </div>

                    <Select
                        isMulti
                        options={selectOptions}
                        value={selectValue}
                        onChange={(new_selected) => {
                            const new_selected_id = new_selected.map(
                                ({ id }) => id
                            );
                            setData("user_ids", new_selected_id);
                        }}
                        className="mb-4 text-base-content"
                        placeholder="Select users..."
                        formatOptionLabel={(option: OptionType, type) => {
                            if (type.context == "menu") {
                                return (
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            className="rounded-full w-10"
                                            name={option.name}
                                        />
                                        <div>
                                            <div>{option.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {option.email}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return option.name;
                        }}
                    />
                    {!!errors.user_ids && (
                        <span className="text-error">{errors.user_ids}</span>
                    )}
                    <Button
                        disabled={!hasChanges}
                        color="primary"
                        className="w-full"
                    >
                        {processing ? (
                            <Loading className="loading-xs" />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DropdownContent>
            </Dropdown>
        </form>
    );
}
