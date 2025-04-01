import { useContext } from "react";
import { SweetAlertContext } from "./Context/SweetAlertContext";

export const useSwal = () => useContext(SweetAlertContext);
