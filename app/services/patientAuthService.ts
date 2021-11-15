import { TelehealthUser } from "../types";
import jwtDecode from "jwt-decode";

function authenticatePatient(token: string): Promise<TelehealthUser> {
    const tokenInfo = jwtDecode(token, { header: true }) as {
        name: string,
        role: string,
    };
    return Promise.resolve({
        ...tokenInfo,
        isAuthenticated: true,
        token: token
    } as TelehealthUser);
}

export default {
    authenticatePatient
};