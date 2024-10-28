import { useMutation } from '@tanstack/react-query';
import axios from "axios";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  password2: string;
}


const signupApi = async (data: SignupFormData) => {
  const response = await axios.post(
    'http://localhost:8000/api/auth/signup/',
    data
  );
  return response.data
}

const useSignup = () => {
  // return useMutation<SignupFormData, Error, SignupFormData>(signupApi);
  return useMutation({
    mutationFn: signupApi
  });

}
      // onSuccess(data, va, con) {
      //   console.log(data);
      //   console.log('---------------------');
      //   console.log(va);
      //   console.log('---------------------');
      //   console.log(con);
      //   console.log('---------------------');
        // setAuthState(true);
        // setAuthResponse({
        //   isRequesting: true,
        //   isSuccess: true,
        //   message: data,
        //   error: null,
        // });
      // },
      // onError(error) {
      //   // setAuthResponse({isRequesting: true, isSuccess: true, data: data, error: null});
      //   console.log(error);
      //   // setSignupState(true);
      // },
    // });



    // const [signupState, setSignupState] = useState(false);





// }

export default useSignup
