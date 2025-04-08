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
    description: string;
    updated_at: string;
}
export interface ExamContext {
    created_at: string;
    id: number;
    content: string;
    updated_at: string;
}

export interface Message {
    is_gaia: boolean;
    content: string;
    created_at: string;
    id: number;
}

export interface ExamNotes {
    content: string;
    exam_file_id: number;
    owner_id: number;
}
