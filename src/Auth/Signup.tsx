import { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import bgImage from "../assets/signupBg.svg";

const PWD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*&_-])[A-Za-z\d!@#$%*&_-]{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false)

  const handleChangePassword = () =>{
    setShowPassword(!showPassword)
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log({errors})

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({
      ...errors,
      [name] : ""
    })
  };

  const validate = () => {
    const errors = {};

    // Name validation
    if (!formData.username) {
      errors.username = 'Name is required';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }

    // Password validation
    if (!formData.password) {
       errors.password = 'Password is required';
    } if (formData.password.length < 6) {
       errors.password = 'Password must be at least 6 characters long';
    }
    else if(!PWD_REGEX.test(formData.password)){
       errors.password = 'Password must be alphanumeric with special symbols';
    }

    if (!formData.acceptedTerms) {
      errors.acceptedTerms = 'You must accept the terms and conditions';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("over here")
    if (validate()) {
      console.log('Form data is valid:', formData);
      // createAccount()
    } else {
      console.log('Form data is invalid:', errors);
    }
  };
  return (
    <section style={{backgroundImage: `url(${bgImage})`}} className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col w-full  max-w-md p-6 rounded-md md:p-10 bg-white border-[0.3px] border-[#B9B9B9]">
        <div className="mb-5 text-center">
          <h1 className="my-1 text-3xl font-bold text-[#202224]">Create An Account</h1>
          <p className="text-base text-[#202224]">Create a account to continue</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
          <div>
              <label htmlFor="email" className="block mb-1 text-base text-[#202224]">Email address</label>
              <input value={formData.email} onChange={handleChange} type="email" name="email" id="email" placeholder="esteban_schiller@gmail.com" className={`font-nunito focus-visible:outline-0 w-full px-4 py-2 text-[#202224] text-sm border rounded-md ${errors.email ? "border-orange-600":"border-[#D8D8D8]"} bg-[#F1F4F9] placeholder-[#A6A6A6]`}/>
              {errors.email && <p className="text-xs text-orange-700">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="username" className="block mb-1 text-base text-[#202224]">Username</label>
              <input value={formData.username} onChange={handleChange} type="text" name="username" id="username" placeholder="username" className={`font-nunito focus-visible:outline-0 w-full px-4 py-2 border rounded-md text-sm ${errors.username ? "border-orange-600" :"border-[#D8D8D8]"} bg-[#F1F4F9] text-[#202224] placeholder-[#A6A6A6]`}/>
              {errors.username && <p className="text-xs text-orange-700">{errors.username}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block mb-1 text-base text-[#202224]">Password</label>
                <a rel="noopener noreferrer" href="#" className="text-xs hover:underline text-[#202224]">Forgot password?</a>
              </div>
              <div className={`flex items-center border rounded-md gap-1 pr-1 ${errors.password ?"border-orange-600" : "border-[#D8D8D8]"} bg-[#F1F4F9]`}>
              <input value={formData.password} onChange={handleChange} type={ showPassword ? "text":"password"} name="password" id="password" placeholder="*****" className={`font-nunito focus-visible:outline-0 w-full px-4 py-2  text-sm  text-[#202224] placeholder-[#A6A6A6]`}/>
              <div className='ml-auto w-fit'>{showPassword ?<FiEyeOff onClick={handleChangePassword} size={18} />: <FiEye onClick={handleChangePassword} size={18} />}</div>
              </div>
              {errors.password && <p className="text-xs text-orange-700">{errors.password}</p>}
            </div>
            <div className="flex items-center flex-wrap">
              <input checked={formData.acceptedTerms} onChange={handleChange} type="checkbox" name="acceptedTerms" id="remember" aria-label="accept terms and conditions" className="mr-1 rounded-sm bg-gray cursor-pointer checked:border border-[#A3A3A3] accent-white" />
              <label htmlFor="acceptedTerms" className="text-sm dark:text-gray-400 cursor-pointer">I accept terms and conditions</label>
              {errors.acceptedTerms && <p className="text-xs text-orange-700 mt-1 basis-3/4">{errors.acceptedTerms}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <button type="submit" className="w-full px-8 py-3 font-medium rounded-md hover:bg-[#5A8CFF] bg-[#4880FF] text-white">Sign Up</button>
            </div>
            <p className="px-3 text-sm text-center text-gray-400">Already have an account ?
              <Link rel="noopener noreferrer" to="/" className=" ml-2 underline text-[#4880FF]">Log in</Link>.
            </p>
          </div>
        </form>
      </div>
      </section>
  )
}

export default SignUp