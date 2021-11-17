import { PatientUser } from "../types";
import jwtDecode from "jwt-decode";

type PatientJwtToken = {
    grants: {
        patient: {
            visitId: string,
            role: string,
            name: string
        }
    }
}

function authenticatePatient(token: string): Promise<PatientUser> {
    // TODO: Add Token Validation
    const tokenInfo = jwtDecode(token) as PatientJwtToken;
    return Promise.resolve({
        ...tokenInfo.grants.patient,
        isAuthenticated: true,
        token: token
    } as PatientUser);
}

export default {
    authenticatePatient
};