import { FormEvent, useCallback, useState } from "react";
import ModalLayout from "@/Layouts/ModalLayout";
import { FaStar } from "react-icons/fa";
import { router, useForm, usePage } from "@inertiajs/react";
import Loading from "@/Components/Loading/Loading";
import { PageProps } from "@/types";

export default function RateUsPage() {
    const {
        props: { has_rating },
    } = usePage<PageProps<{ has_rating: boolean }>>();

    const [hover, setHover] = useState(0);

    const { data, setData, processing, errors, post } = useForm({
        rating: 0,
        feedback: "",
    });

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            post(route("rate-us.store"));
        },
        [post]
    );

    if (!has_rating) {
        return (
            <ModalLayout>
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-center text-primary mb-6">
                        Rate Your Experience
                    </h2>

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="flex justify-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData("rating", star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none"
                                >
                                    <FaStar
                                        size={30}
                                        className={`transition-colors duration-200 cursor-pointer ${
                                            star <= data.rating
                                                ? "text-warning"
                                                : `${
                                                      star <= hover
                                                          ? "text-warning/50 animate-pulse"
                                                          : "text-base-300"
                                                  }`
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={data.feedback}
                            onChange={({ target }) =>
                                setData("feedback", target.value)
                            }
                            className="textarea textarea-bordered w-full"
                            placeholder="Tell us what you liked or what could be improved..."
                            rows={4}
                        />

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            {processing ? <Loading /> : "Submit Feedback"}
                        </button>
                    </form>
                </div>
            </ModalLayout>
        );
    } else {
        return (
            <ModalLayout>
                <div className="p-6 flex flex-col items-center text-center space-y-6">
                    <h2 className="text-3xl font-bold text-primary">
                        Thank You for Your Feedback! 🌟
                    </h2>
                    <p className="text-base-content text-lg max-w-md">
                        You’ve already submitted your rating. We appreciate you
                        taking the time to help us improve GAIA — your
                        interactive learning companion!
                    </p>

                    <div className="w-full">
                        <button
                            className="btn btn-outline btn-secondary w-full"
                            onClick={() =>
                                router.visit(route("dashboard.index"))
                            }
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </ModalLayout>
        );
    }
}
