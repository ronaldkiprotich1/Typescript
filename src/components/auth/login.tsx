import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";

type LoginInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .max(100, "Max 100 characters")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Min 8 characters")
    .max(100, "Max 100 characters")
    .required("Password is required"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-2xl flex flex-col w-full max-w-lg p-8 rounded-md">
        <div>
          <h2 className="text-center font-semibold text-xl md:text-2xl ">
            Login
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full  mt-4"
        >
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />
          {errors.email && (
            <span className="text-rose-500 text-sm">
              {errors.email.message}
            </span>
          )}

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />
          {errors.password && (
            <span className="text-rose-500 text-sm">
              {errors.password.message}
            </span>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600  p-2 rounded-md mt-4 text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;