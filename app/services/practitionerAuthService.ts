import { TelehealthUser } from "../types";
import jwtDecode from "jwt-decode";

type PractitionerJwtToken = {
  grants: {
    practitioner: {
      role: string,
      name: string
    }
  }
}

function authenticatePractitioner(token: string): Promise<TelehealthUser> {
  const tokenInfo = jwtDecode(token) as PractitionerJwtToken;
  return Promise.resolve({
    ...tokenInfo.grants.practitioner,
    isAuthenticated: true,
    token
  } as TelehealthUser);
}

export default { authenticatePractitioner };