import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import TestLinkModal from "./partial/TestLinkModal";

export default function TakenTestLink() {
    const {
        props: { test_link },
    } = usePage<
        PageProps<{
            test_link: {
                pretest?: string;
                posttest?: string;
                feedback?: string;
            };
        }>
    >();

    const { pretest, posttest, feedback } = test_link;

    return (
        <>
            {!!pretest && <TestLinkModal label="Take Pre-test" src={pretest} />}
            {!!posttest && (
                <TestLinkModal label="Take Post-Test" src={posttest} />
            )}
            {!!feedback && (
                <TestLinkModal label="Rate Us" src={feedback} isSmall />
            )}
        </>
    );
}
