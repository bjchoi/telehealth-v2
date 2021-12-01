import { PatientUser } from "../types";
import jwtDecode from "jwt-decode";
import { Uris } from "./constants";

type PatientJwtToken = {
    grants: {
        patient: {
            visitId: string,
            role: string,
            name: string
        }
    }
}

function authenticatePatient(passcode: string): Promise<PatientUser> {
    return fetch(Uris.get(Uris.visits.patientToken), {
        method: 'POST',
        body: JSON.stringify({ action: "TOKEN", passcode }),
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(r => r.json())
    .then(tokenResp => {
        const tokenInfo = jwtDecode(tokenResp.token) as PatientJwtToken;
        return {
            ...tokenInfo.grants.patient,
            isAuthenticated: true,
            token: tokenResp.token
        } as PatientUser;
    });
}

export default {
    authenticatePatient
};