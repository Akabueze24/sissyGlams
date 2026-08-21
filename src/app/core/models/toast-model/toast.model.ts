import { ToastType } from "./toast-type.model";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}