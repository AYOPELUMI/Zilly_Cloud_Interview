import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/signupBg.svg";

const Login = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailBorderColor, setEmailBorderColor] = useState("");
    const [passwordBorderColor, setPasswordBorderColor] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        setLoginData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    // const handleFocus = (e) => {
    //     const { value } = e.target;

    //     if (!value)
    // };

    const login = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        const adminAuth = {
            admin: { id: 1, nin: "22345600676", email: loginData.email },
        };

        // const response = await fetch("{{baseUrl}}/api/v1/users", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         nin: "22345600676",
        //         email: loginData.email,
        //         password: loginData.password,
        //     }),
        // });

        // if (response.statusCode === 200) {
        //     setIsSubmitting(false)
        //     sessionStorage.setItem("adminAuth", JSON.stringify(adminAuth));
        //     navigate("/admin/dashboard");
        // }

        setTimeout(() => {
            sessionStorage.setItem("adminAuth", JSON.stringify(adminAuth));
            setIsSubmitting(false);
            navigate("/admin/dashboard");
        }, 3000);
    };

    return (
        <div
            className={`h-screen w-screen flex px-4 justify-center items-center gap-6 bg-[#4880FF]`}
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

                <form action="" className="space-y-8">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-nunito">
                                Email address
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Email address"
                                className={`px-4 py-2 rounded-lg font-nunito bg-[#F1F4F9] text-[#202224] focus:outline-none border`}
                                value={loginData.email}
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
                                className="tracking-widest font-nunito text-[#202224] px-4 py-2 rounded-lg focus:outline-none bg-[#F1F4F9] border border-[#D8D8D8]"
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
                            onClick={login}
                            className="bg-[#4880FF] hover:bg-[#5A8CFF] font-medium font-nunito text-white text-center px-2 py-3 rounded-lg"
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </button>
                        <p className="text-center font-nunito">
                            Don't have an account?{" "}
                            <Link
                                to="/admin/signup"
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
