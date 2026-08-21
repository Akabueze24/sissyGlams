import { AuthMode } from "../../services/auth-service/auth.service";

export interface AuthModalRequest {
  mode: AuthMode;
  redirectUrl?: string;
}
