import { createContext } from "react";
import Swal from "sweetalert2";
import { ReactSweetAlert } from "sweetalert2-react-content";

type SweetAlertType = typeof Swal & ReactSweetAlert;
export const SweetAlertContext = createContext<SweetAlertType | undefined>(
    undefined
);
