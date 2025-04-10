export type Color =
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export type UserMessageSent = {
    exam_file_id: number;
    sender_id: number;
};

export type GAIAStatus = {
    exam_file_id: number;
    status: "listening" | "typing" | "responded";
};

export type GAIAResponse = {
    exam_file_id: number;
    response: string;
};
