import platform from 'platform';
import { useEffect, useState } from "react";
import { useMutation } from 'react-query';
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/signupBg.svg";
import { signIn } from "./api";


interface  data {
    email: string | null;
    password: string | null;
  }
  interface  loginData {
    username: string ;
    password: string ;
    device_type: string
  }

  const PWD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*&_-])[A-Za-z\d!@#$%*&_-]{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginData, setLoginData] = useState<loginData>({
        username: "",
        password: "",
        device_type :""
    });
    const [errors, setErrors] = useState<data>({
        email: "",
        password: "",
    });

    useEffect(() => {
        if(platform.os.family){
            setLoginData({
                ...loginData,
                "device_type": platform.os.family,
            })
        }
    }, []);

    const mutation = useMutation(signIn, {
        onSuccess: (data) => {
        //   localStorage.setItem('token', data.token);
        //   navigate('/dashboard');
        console.log({data})
        setTimeout(() => {;
            setIsSubmitting(false);
            // navigate("/dashboard");
        }, 3000);
        },
        onError: (error) => {
          console.error('Login failed:', error);
        },
      });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        setLoginData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const validate =() =>{
        const error:data = {
            email: null,
            password: null,
            
        };
        if(!loginData.username){
            error.email = "email required"
        }else if (!EMAIL_REGEX.test(loginData.username)) {
            error.email = 'Email address is invalid';
          }

        if (!loginData.password) {
            error.password = 'Password is required';
         } if (loginData.password.length < 6) {
            error.password = 'Password must be at least 6 characters long';
         }
         else if(!PWD_REGEX.test(loginData.password)){
            error.password = 'Password must be alphanumeric with special symbols';
         }

         setErrors(error)
        return Object.values(error).every(value => value === null);

    }

    const login = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true); 
         if (validate()){
                
        const formData = new FormData()
        
        for(const key in loginData){
            const value = loginData[key as keyof loginData];

            if (value !== null) {
                formData.append(key, value);
            }
        }
             mutation.mutate(formData);

         }
    };

    return (
        <div
            className={`min-h-screen w-screen flex px-4 justify-center items-center gap-6 bg-[#4880FF]`}
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="w-full text-base max-w-md p-10 text-[#202224] bg-white rounded-lg space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-bold font-nunito">
                        Login to Account
                    </h1>
                    <p className="font-nunito">
                        Please enter your email and password to continue
                    </p>
                </div>

                <form action=""onSubmit={login} className="space-y-8">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-nunito">
                                Email address
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="username"
                                placeholder="Email address"
                                className={`px-4 py-2 rounded-lg font-nunito ${errors.email ? "border-orange-600" :"border-[#D8D8D8]"} text-[#202224] focus:outline-none border`}
                                value={loginData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <label
                                    htmlFor="password"
                                    className="font-nunito"
                                >
                                    Password
                                </label>
                                <Link
                                    to="/admin/forgot-password"
                                    className="font-nunito"
                                >
                                    Forgot Password
                                </Link>
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className={`tracking-widest font-nunito text-[#202224] px-4 py-2 rounded-lg focus:outline-none ${errors.password ? "border-orange-600" :"border-[#D8D8D8]"} border border-[#D8D8D8]`}
                                value={loginData.password}
                                onChange={handleChange}
                            />

                            <div className="mt-1">
                                <input
                                    type="checkbox"
                                    name="remember-password"
                                    id="remember-password"
                                    className="mr-2 accent-white border"
                                />
                                <label
                                    htmlFor="remember-password"
                                    className="font-nunito"
                                >
                                    Remember Password
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            className="bg-[#4880FF] hover:bg-[#5A8CFF] font-medium font-nunito text-white text-center px-2 py-3 rounded-lg"
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </button>
                        <p className="text-center font-nunito">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-[#5A8CFF] font-medium underline underline-offset-2"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
