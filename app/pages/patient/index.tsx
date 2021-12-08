import { useRouter } from 'next/router';
import { useEffect } from 'react';
import patientAuth from '../../services/authService';
import visitService from '../../services/visitService';
import clientStorage from '../../services/clientStorage';
import { STORAGE_USER_KEY, STORAGE_VISIT_KEY } from '../../constants';


const PatientLanding = () => {
  const router = useRouter();
  useEffect(() => {
    var token = router.query.token as string;
    if(token) {
      patientAuth.authenticateVisitorOrPatient(token)
      .then(u => {
        clientStorage.saveToStorage(STORAGE_USER_KEY, u);
        return visitService.getVisitForPatient(u);
      }).then(v => {
        if(v) {
          clientStorage.saveToStorage(STORAGE_VISIT_KEY, v);
          router.push('/patient/waiting-room');
        }
      });
      // TODO: Implement CATCH
    }
  }, [router]);

  return (
    <p>Please wait! You will be redirected to a call shortly.</p>
  );
};

export default PatientLanding;