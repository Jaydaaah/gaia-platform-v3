import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import ThemeItem from "./ThemeItem";

export default function ThemeController() {
    const initialTheme = useMemo(() => {
        const selected_theme = localStorage.getItem("selected_theme");
        return selected_theme;
    }, []);

    const [selected, setSelected] = useState(initialTheme ?? "light");

    useEffect(() => {
        localStorage.setItem("selected_theme", selected);
    }, [selected]);

    const onChange = useCallback(
        ({ target }: ChangeEvent<HTMLInputElement>) => {
            setSelected(target.value);
        },
        []
    );

    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                Theme
                <svg
                    width="12px"
                    height="12px"
                    className="inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl max-h-96 overflow-y-auto"
            >
                {themes.map((theme) => (
                    <li key={theme.value}>
                        <ThemeItem
                            {...theme}
                            onChange={onChange}
                            checked={selected == theme.value}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

const themes = [
    { title: "Light", value: "light" },
    { title: "Dark", value: "dark" },
    { title: "Cupcake", value: "cupcake" },
    { title: "Bumblebee", value: "bumblebee" },
    { title: "Emerald", value: "emerald" },
    { title: "Corporate", value: "corporate" },
    { title: "Synthwave", value: "synthwave" },
    { title: "Retro", value: "retro" },
    { title: "Cyberpunk", value: "cyberpunk" },
    { title: "Valentine", value: "valentine" },
    { title: "Halloween", value: "halloween" },
    { title: "Garden", value: "garden" },
    { title: "Forest", value: "forest" },
    { title: "Aqua", value: "aqua" },
    { title: "Lofi", value: "lofi" },
    { title: "Pastel", value: "pastel" },
    { title: "Fantasy", value: "fantasy" },
    { title: "Wireframe", value: "wireframe" },
    { title: "Black", value: "black" },
    { title: "Luxury", value: "luxury" },
    { title: "Dracula", value: "dracula" },
    { title: "CMYK", value: "cmyk" },
    { title: "Autumn", value: "autumn" },
    { title: "Business", value: "business" },
    { title: "Acid", value: "acid" },
    { title: "Lemonade", value: "lemonade" },
    { title: "Night", value: "night" },
    { title: "Coffee", value: "coffee" },
    { title: "Winter", value: "winter" },
    { title: "Dim", value: "dim" },
    { title: "Nord", value: "nord" },
    { title: "Sunset", value: "sunset" },
    { title: "Caramel Latte", value: "caramellatte" },
    { title: "Abyss", value: "abyss" },
    { title: "Silk", value: "silk" },
];
