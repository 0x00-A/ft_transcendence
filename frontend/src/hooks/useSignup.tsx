import { useMutation } from "react-query";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const useSignup = () => {

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<SignupFormData>({
      resolver: yupResolver(schema),
      delayError: 1000,
    });

    // const [signupState, setSignupState] = useState(false);

    const mutation = useMutation<SignupFormData, Error, SignupFormData>({
      mutationFn: addNewUser,
      onSuccess(data, va, con) {
        console.log(data);
        console.log('---------------------');
        console.log(va);
        console.log('---------------------');
        console.log(con);
        console.log('---------------------');
        setAuthState(true);
        setAuthResponse({
          isRequesting: true,
          isSuccess: true,
          message: data,
          error: null,
        });
      },
      onError(error) {
        // setAuthResponse({isRequesting: true, isSuccess: true, data: data, error: null});
        console.log(error);
        // setSignupState(true);
      },
    });

    const handleSignup = (data: SignupFormData, event: any) => {
      event.preventDefault();
      mutation.mutate(data);
    };

}

export default useSignup
