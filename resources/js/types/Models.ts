export interface Folder {
    created_at: string;
    id: number;
    name: string;
    owner_id: number;
    parent_id: number;
    updated_at: string;
}

export interface ExamFile {
    created_at: string;
    id: number;
    name: string;
    subject: string;
    owner_id: number;
    description: string;
    updated_at: string;
}
export interface ExamContext {
    created_at: string;
    id: number;
    content: string;
    instruction: string;
    updated_at: string;
}

export interface Message {
    id: number;
    sender_id?: number;
    is_gaia: boolean;
    content: string;
    created_at: string;
    reply_to?: Message;
}

export interface ExamNotes {
    content: string;
    exam_file_id: number;
    owner_id: number;
}

export interface ExamBot {
    exam_file_id: number;
    name: string;
    voice_uri: string;
}
