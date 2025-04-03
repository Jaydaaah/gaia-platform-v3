import { PageProps } from "@/types";

export type UploadPage = PageProps<{
    folder_id: number | null;
    filename: string;
    context_id: number;
}>;
