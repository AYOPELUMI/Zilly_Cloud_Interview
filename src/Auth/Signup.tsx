import platform from 'platform';
import { useEffect, useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { BsCameraFill } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useMutation } from 'react-query';
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/signupBg.svg";
import { createAccount } from './api';

interface  RegisterData {
    email: string;
    password: string;
    name: string;
    password_confirmation: string;
    avatar: File | null;
    dp: string | null;
    phone: string;
    device_type: string | undefined | null;
    locality_id: string;
  }

  type errorData = {
    email: string | null;
    password: string | null;
    name: string | null;
    password_confirmation: string | null;
    avatar: string | null;
    phone: string | null;
  }

const PWD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*&_-])[A-Za-z\d!@#$%*&_-]{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUp = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    password_confirmation: '',
    avatar: null, // Initializing with null
    dp: "",
    phone: '',
    device_type: '',
    locality_id: ''
  });

  const navigate = useNavigate()

  const [errors, setErrors] = useState<errorData>({
    email: '',
    password: '',
    name: '',
    password_confirmation: '',
    avatar: "", // Initializing with null
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)


useEffect(() => {
    if(platform && platform.os){
        setFormData({
            ...formData,
            "device_type": platform.os.family,
            locality_id : "23"
        })
    }
    return () => {
        
    };
}, []);

  const handleChangePassword = () =>{  
    setShowPassword(!showPassword)
  }
  const handleChangeConfirmPassword = () =>{
    
    setShowConfirmPassword(!showConfirmPassword)
  }
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked} = e.target;
    console.log(e.target.name)

    if( name  == "phone"){
        const regExp = /^\d+$/;
            if (value.length<12){
                if (value ==="" || regExp.test(value)) {
                    setFormData({
                            ...formData,
                            phone:value
                        })
                        setErrors({
                            ...errors,
                            [name] : ""
                          })
                }
            }
        return
    }
    if( name  != "phone"){
        setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({
      ...errors,
      [name] : ""
    })
}
  };

  const editImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target.files;
  
    if (fileInput && fileInput.length > 0) {
      const selectedFile = fileInput[0];
  
      if (!selectedFile.type.startsWith('image/')) {
        setErrors({ ...errors, avatar: 'Please select a valid image file.' });
        console.log('Please select a valid image file.');
        return;
      }
  
      if (selectedFile.name.length > 256) {
        setErrors({ ...errors, avatar: 'File name is too long. Please rename the file.' });
        console.log('File name is too long. Please rename the file.');
        return;
      }
  
      // Create an object URL for image preview
      const imageUrl = URL.createObjectURL(selectedFile);
  
      // Update state with selected file and clear errors
      setFormData({ ...formData, dp: imageUrl, "avatar" : selectedFile });
      setErrors({ ...errors, avatar: '' });
    }
  };

    const validate = () => {
      const error:errorData = {
          email: null,
          password: null,
          name: null,
          password_confirmation: null,
          avatar: null, // Initializing with null
          phone: null,
      };

    // Name validation
    if (!formData.name) {
        console.log("name")
      error.name = 'Name is required';
    }

    if (!formData.avatar) {
    error.avatar = 'Avatar is required';
  }
    if (!formData.phone) {
        error.phone = 'phone number is required';
      }
      else if (formData.phone.length <= 10) {
        error.phone = 'Incomplete Phone Number';
      }

    // Email validation
    if (!formData.email) {
      error.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      error.email = 'Email address is invalid';
    }

    // Password validation
    if (!formData.password) {
       error.password = 'Password is required';
    } if (formData.password.length < 6) {
       error.password = 'Password must be at least 6 characters long';
    }
    else if(!PWD_REGEX.test(formData.password)){
       error.password = 'Password must be alphanumeric with special symbols';
    }
    if (!formData.password_confirmation) {
        error.password_confirmation = 'Confirm Password is required';
     } if (formData.password_confirmation.length < 6) {
        error.password_confirmation = 'Password must be at least 6 characters long';
     }
     else if(!PWD_REGEX.test(formData.password_confirmation)){
        error.password_confirmation = 'Password must be alphanumeric with special symbols';
     }
     else if(formData.password_confirmation != formData.password){
        error.password_confirmation= "Passwords does not conform"
     }

     console.log({error})
    setErrors(error);

    return Object.values(error).every(value => value === null);
  };

  const mutation = useMutation(createAccount, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
    //   navigate('/dashboard');
      setTimeout(() =>{
        setIsSubmitting(false)
      toast.success("account created successfully")},2000)
            setTimeout(() =>{
      navigate("/")},3000)
      },
    onError: (error) => {
      console.error('sign up failed:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("over here")
    if (validate()) {
      setIsSubmitting(true)
        const newFormData = new FormData()
        
        for(const key in formData){
            const value = formData[key as keyof RegisterData];

            if (value !== null && value !== undefined) {
                newFormData.append(key, value);
            }
        }

      console.log('Form data is valid:', newFormData);
      mutation.mutate(newFormData);

      // createAccount()
    } else {
      console.log('Form data is invalid:', errors);
    }
  };

  console.log({formData})

  return (
    <section style={{backgroundImage: `url(${bgImage})`}} className="w-screen min-h-screen flex justify-center items-center">
      <div className="relative flex flex-col  md:p-10 rounded-md p-6 bg-white border-[0.3px] border-[#B9B9B9]">
      <Toaster />
        <div className="mb-5 text-center">
          <h1 className="my-1 text-3xl font-bold text-[#202224]">Create An Account</h1>
          <p className="text-base text-[#202224]">Create a account to continue</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3  grid md:grid-cols-2 gap-6">
          <div>Avatar
          <label className="block overflow-hidden relative w-24 h-24 ">
                <img className={`h-24 w-24 object-cover border-2 rounded-full hover:opacity-50 ${errors.avatar ? "border-orange-600" :"border-[#D8D8D8]"}`} src={typeof formData.dp === 'string' ? formData.dp : '/default-avatar.png'} />
                <div className=" rounded-full cursor-pointer bg-[#00000040] absolute top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-all">
                <BsCameraFill className="w-6 h-6 fill-white" />
                  <span className="text-xs w-6/12 text-center text-white">CHANGE PIC</span>
                </div>
                <input type="file" accept='image/' id="avatar" name="avatar" className="hidden w-full text-sm text-slate-500
                  file:mr-2 md:file:mr-4 file:py-4 file:px-6
                  file:rounded-full file:border-0
                  file:text-base file:font-semibold
                  file:bg-violet-50 file:text-[#22C55E]
                  hover:file:bg-[#22C55EFF] hover:file:text-white
                "
                onChange={editImage}/>

              </label>
              {errors.avatar && <p className="text-xs text-orange-700">{errors.avatar}</p>}
              </div>
            <div className="self-end">
              <label htmlFor="name" className="block mb-1 text-base text-[#202224]">Full Name</label>
              <input value={formData.name} onChange={handleChange} type="text" name="name" id="name" placeholder="Full Name" className={`font-nunito focus-visible:outline-0 w-full px-3 py-2 border rounded-md text-sm ${errors.name ? "border-orange-600" :"border-[#D8D8D8]"} bg-[#F1F4F9] text-[#202224] placeholder-[#A6A6A6]`}/>
              {errors.name && <p className="text-xs text-orange-700">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-base text-[#202224]">Email address</label>
              <input value={formData.email} onChange={handleChange} type="email" name="email" id="email" placeholder="esteban_schiller@gmail.com" className={`font-nunito focus-visible:outline-0 w-full px-3 py-2 text-[#202224] text-sm border rounded-md ${errors.email ? "border-orange-600":"border-[#D8D8D8]"} bg-[#F1F4F9] placeholder-[#A6A6A6]`}/>
              {errors.email && <p className="text-xs text-orange-700">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 text-base text-[#202224]">Phone Number</label>
              <input value={formData.phone} onChange={handleChange} type="text" name="phone" id="phone" placeholder="usephonername" className={`font-nunito focus-visible:outline-0 w-full px-3 py-2 border rounded-md text-sm ${errors.phone ? "border-orange-600" :"border-[#D8D8D8]"} bg-[#F1F4F9] text-[#202224] placeholder-[#A6A6A6]`}/>
              {errors.phone && <p className="text-xs text-orange-700">{errors.phone}</p>}
            </div>
            <div>
                <label htmlFor="password" className=" block mb-1 text-base text-[#202224]">Password</label>
              <div className={`overflow-hidden flex items-center border rounded-md gap-1 pr-1 ${errors.password ?"border-orange-600" : "border-[#D8D8D8]"} bg-[#F1F4F9]`}>
                <input value={formData.password} onChange={handleChange} type={ showPassword ? "text":"password"} name="password" id="password" placeholder="*****" className={`font-nunito focus-visible:outline-0 w-full px-3 py-2  text-sm  text-[#202224] placeholder-[#A6A6A6]`}/>
                <div className='ml-auto w-fit'>{showPassword ?<FiEyeOff onClick={handleChangePassword} size={18} />: <FiEye onClick={handleChangePassword} size={18} />}</div>
                </div>
                {errors.password && <p className="text-xs text-orange-700">{errors.password}</p>}
            </div>

            <div>
            <label htmlFor="password_confirmation" className="overflow-hidden block mb-1 text-base text-[#202224]"> Confirm Password</label>
            <div className={`flex items-center border rounded-md gap-1 pr-1 ${errors.password_confirmation ? "border-orange-600" : "border-[#D8D8D8]"} bg-[#F1F4F9]`}>
                <input value={formData.password_confirmation} onChange={handleChange} type={ showConfirmPassword ? "text":"password"} name="password_confirmation" id="password_confirmation" placeholder="*****" className={`bg-transparent font-nunito focus-visible:outline-0 w-full px-3 py-2  text-sm  text-[#202224] placeholder-[#A6A6A6]`}/>
                <div className='ml-auto w-fit'>{showConfirmPassword ?<FiEyeOff onClick={handleChangeConfirmPassword} size={18} />: <FiEye onClick={handleChangeConfirmPassword} size={18} />}</div>
                </div>
                {errors.password_confirmation && <p className="text-xs text-orange-700">{errors.password_confirmation}</p>}
            </div>

          </div>
          <div className="space-y-2">
            <div>
              <button type="submit" className="w-full px-8 py-3 font-medium rounded-md hover:bg-[#5A8CFF] bg-[#4880FF] text-white md:mx-auto">{isSubmitting ? "Signing up ..." : "Sign Up"}</button>
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