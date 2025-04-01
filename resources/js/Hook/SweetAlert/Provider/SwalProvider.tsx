import withReactContent from "sweetalert2-react-content";
import { SweetAlertContext } from "../Context/SweetAlertContext";
import Swal from "sweetalert2";
import { PropsWithChildren } from "react";

const MySwal = withReactContent(Swal);

export default function SwalProvider({ children }: PropsWithChildren) {
    return (
        <SweetAlertContext.Provider value={MySwal}>
            {children}
        </SweetAlertContext.Provider>
    );
}
