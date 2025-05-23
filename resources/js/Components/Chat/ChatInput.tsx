import { InputHTMLAttributes, useState } from "react";
import Button from "../Button/Button";
import FieldSetLabel from "../FieldSet/FieldSetLabel";

interface ChatInputProps {
    error?: string | null;
    processing?: boolean;
}
export default function ChatInput({
    error,
    processing,
    disabled,
    ...props
}: ChatInputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="p-4 bg-base-300 w-full max-w-7xl">
            <div className="flex items-center space-x-4">
                <input
                    {...props}
                    type="text"
                    className="input input-bordered input-primary w-full"
                    placeholder="Type a message..."
                    disabled={processing || disabled}
                />
                <Button type="submit" disabled={processing || disabled}>
                    Send
                </Button>
            </div>
            {!!error && (
                <FieldSetLabel className="text-error text-xs pt-2">
                    {error}
                </FieldSetLabel>
            )}
        </div>
    );
}
