import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { check_mob, loginUser, registerUser, send_otp, verifyOtp } from "../services/auth";
import useFirebase from "../services/firebase";
import InitialData from "../interfaces/initialData";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Popup from "./Popup";

type FormValues = {
    phone: string,
    name?: string,
    otp?: string
}

type PopupContent = {
    title: string
    content: string
}

function FormAuth({firebaseConfig}: {firebaseConfig: InitialData['firebaseConfig']}) {
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, setError, setFocus } = useForm<FormValues>({
        defaultValues: {
            phone: '',
        }
    });

    const { auth } = useFirebase(firebaseConfig)

    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false)
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [popupContent, setPopupContent] = useState<PopupContent>({title: '', content: ''})
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>()

    useEffect(() => {
        reset()
        setIsOtpSent(false)
        setIsLoading(false)
    }, [isLogin, reset])

    useEffect(() => {
        if(isOtpSent){
            setFocus('otp')
        }
    }, [isOtpSent, setFocus])

    const onSubmit = async (data: FormValues) => {
        clearErrors()
        setIsLoading(true)

        const verifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        }, auth)

        data.phone = '+84' + data.phone.substring(1)

        if(!isOtpSent){
            const check_mob_result = await check_mob(data.phone, isLogin ? 'login' : 'register')
               
            if(check_mob_result.success){
                await send_otp({countrycode: '+84', mobileNo: data.phone, type: 'register'})
                const result = await signInWithPhoneNumber(auth, data.phone, verifier)
                setConfirmationResult(result)
                setIsOtpSent(true)
                setIsLoading(false)
            }else{
                setError("phone", {type: 'manual', message: isLogin ? "Số điện thoại chưa được đăng ký" : "Số điện thoại đã được đăng ký"})
                setIsLoading(false)
            }
        } else if(isLogin && confirmationResult && data.otp){
            const result = await verifyOtp(confirmationResult, data.otp, data.phone, 'login')
            if(result.success){
                const userDataRes = await loginUser({countrycode: '+84',user: data.phone, ftoken: result.message, otp: data.otp, dig_ftoken: result.message})
                if(userDataRes.success){
                    setPopupContent({
                        title: 'Thành công',
                        content: 'Bạn đã đăng ký tài khoản thành công! Đang chuyển hướng...'
                    })
                    setIsPopupOpen(true)
                    reset()
                    window.location.href = '/redeem?access_token=' + userDataRes.data.access_token
                }else{
                    setIsLoading(false)
                    setError("phone", {type: 'manual', message: "Số điện thoại chưa được đăng ký"})
                }
            }else{
                setError("otp", {type: 'manual', message: "Mã OTP không đúng"})
                setIsLoading(false)
            }
        } else if(!isLogin && confirmationResult && data.otp){
            const result = await verifyOtp(confirmationResult, data.otp, data.phone, 'register')
            if(result.success){
                const userDataRes = await registerUser({digits_reg_countrycode: '+84',digits_reg_name: data.name, digits_reg_mobile: data.phone, ftoken: result.message, otp: data.otp})
                if(userDataRes.success){
                    setPopupContent({
                        title: 'Thành công',
                        content: 'Bạn đã đăng ký tài khoản thành công! Đang chuyển hướng...'
                    })
                    setIsPopupOpen(true)
                    reset()
                    window.location.href = '/redeem?access_token=' + userDataRes.data.access_token
                }else{
                    setIsLoading(false)
                    setError("otp", {type: 'manual', message: "Số điện thoại đã được đăng ký"})
                }
            }else{
                setError("otp", {type: 'manual', message: "Mã OTP không đúng"})
                setIsLoading(false)
            }
        }

        // send_otp({countrycode: '+84', mobileNo: data.phone, type: 'register'})

        // const res = await redeem(data)

        // setIsLoading(false)
        // if(res.success) {
        //     setPopupContent({
        //         title: res.success ? 'Thành công' : 'Thất bại',
        //         content: res.data.message!
        //     })
    
        //     setIsPopupOpen(true)
        //     reset()
        // } else {
        //     res.data.code!.forEach((element,index) => {
        //         setError(`code.${index}.value`, {type: 'manual', message: element.error})
        //     });
        // }
    };

    return (
    <div className='bg-white rounded px-8 py-10 shadow-lg'>
        <h1 className='text-3xl capitalize font-bold text-center mb-2'>{ isLogin ? 'Đăng nhập' : 'Đăng ký' }</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            {
                !isLogin && (
                    <div className='mb-4'>
                        <label htmlFor="name" className='block font-semibold mb-1'>Họ tên:</label>
                        <input type="text" {...register('name')} id="name" className='border border-gray-300 rounded px-3 py-2 w-full outline-none' placeholder='Tên của bạn' />
                    </div>
                )
            }
            <div className='mb-4'>
                <label htmlFor="phone" className='block font-semibold mb-1'>Số điện thoại:</label>
                <input type="text" {...register('phone', {required: 'Trường này không được để trống', pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g, message: 'Sai định dạng số điện thoại' } })} id="phone" className='border border-gray-300 rounded px-3 py-2 w-full outline-none' placeholder='Số điện thoại của bạn' />
                {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
            </div>
            {
                isOtpSent && (
                    <div className='mb-4'>
                        <label htmlFor="otp" className='block font-semibold mb-1'>Mã OTP:</label>
                        <input type="text" {...register('otp', {required: 'Trường này không được để trống'})} id="otp" className='border border-gray-300 rounded px-3 py-2 w-full outline-none' placeholder='' />
                        {errors.otp && <p className='text-red-500 text-sm mt-1'>{errors.otp.message}</p>}
                    </div>
                )
            }
            {
                isLogin ? (
                    <p className="mb-4 text-sm">Chưa có tài khoản? <span className="cursor-pointer" onClick={()=>setIsLogin(false)}>Đăng ký ngay</span></p>
                ) : (
                    <p className="mb-4 text-sm">Đã có tài khoản? <span className="cursor-pointer" onClick={()=>setIsLogin(true)}>Đăng nhập ngay</span></p>
                )
            }
            <button disabled={isLoading} type="submit" className={`${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary'} items-center leading-none px-3 py-2 rounded mx-auto hover:shadow-[inset_0_0_0_100px_rgba(0,0,0,0.2)] duration-150 flex`}>
                <span>Gửi</span>
                <svg className={`${isLoading ? 'w-5 ml-2 scale-100' : 'w-0 ml-0 scale-0'} duration-75 ease-linear h-5`} version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xmlSpace="preserve">
                    <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                    </path>
                </svg>
            </button>
            <div id="recaptcha-container"></div>
        </form>
        <Popup isOpen={isPopupOpen} onClose={()=>setIsPopupOpen(false)} closeBtn="Đóng" title={popupContent.title}>
            <div className=''>
                {popupContent.content}
            </div>
        </Popup>
    </div>
    );
}

export default FormAuth;