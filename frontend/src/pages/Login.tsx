import { useState } from "react";
import styles from "./Login.module.css";
import { useForm } from "react-hook-form";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");


  const { register, handleSubmit} = useForm();

  // const createUser = async (data: FormData) => {
  //   const {data: response} = await
  //   axios
  //     .post("http://localhost:8000/accounts/signup/", {data})
  //   return response.data;
  // };

  // const { data: user, error } = useQuery({
  //   queryKey: ['user'],
  //   queryFn: createUser
  // })
  // const mutation = useMutation<FormData>((data) => {
  //   axios.post("http://localhost:8000/accounts/signup/", data).
  // })

  // const addUser = useMutation({
  //   mutationFn: (user: FormData) =>
  //     axios
  //       .post("http://localhost:8000/api/signup/", user)
  //       .then(res => res.data)
  // });

  const onSubmit = (data: any, event:any) => {
    console.log(data);
    event.preventDefault();
    addUser.mutate(data);
  };

  return (
    <main className={styles.login}>
      <form className={styles.form} onSubmit={ handleSubmit(onSubmit) }>
        <div className={styles.row}>
          <label htmlFor="username">Email address</label>
          <input type="email" id="email" value={email} {...register('username')}/>
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button>Login</button>
        </div>
      </form>
    </main>
  );
}
