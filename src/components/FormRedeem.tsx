import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Popup from "./Popup";
import redeem from "../services/redeem";
import InitialData from "../interfaces/initialData";

type FormValues = {
    name: string
    phone: string
    code: {
        value: string
    }[]
}

type PopupContent = {
    title: string
    content: string
}

function FormRedeem({ redirectUrl, userID }: { redirectUrl: InitialData['redirectUrl'],userID: InitialData['userID'] }) {
    const queryParameters = new URLSearchParams(window.location.search)
    const { control, register, handleSubmit, formState: { errors }, clearErrors, setError, reset } = useForm<FormValues>({
        defaultValues: {
            name: '',
            phone: queryParameters.get("phone") || "",
            code: [
                {value: ''}
            ]
        }
    });

    const { fields, append, remove } = useFieldArray<FormValues>({
        control,
        name: "code",
      });

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [popupContent, setPopupContent] = useState<PopupContent>({title: '', content: ''})

    const onSubmit = async (data: FormValues) => {
        clearErrors()
        setIsLoading(true)

        const res = await redeem(data, userID)

        setIsLoading(false)
        if(res.success && res.data.message) {
            setPopupContent({
                title: res.success ? 'Thành công' : 'Thất bại',
                content: res.data.message
            })
    
            setIsPopupOpen(true)
            reset()
            window.location.href = redirectUrl
        } else if(res.data.code) {
            res.data.code.forEach((element,index) => {
                setError(`code.${index}.value`, {type: 'manual', message: element.error})
            });
        }
    };

    return (
    <div className='bg-[#fdbc5a] rounded px-8 py-10 shadow-lg'>
        <h1 className='text-3xl capitalize font-bold text-center mb-2'>Đổi mã</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4'>
                <label htmlFor="name" className='block font-semibold mb-1'>Họ tên: </label>
                <input type="text" {...register('name', {required: 'Trường này không được để trống'})} id="name" className='border border-gray-300 rounded px-3 py-2 w-full outline-none' placeholder='Tên của bạn' />
                {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
            </div>
            <div className='mb-4'>
                <label htmlFor="phone" className='block font-semibold mb-1'>Số điện thoại:</label>
                <input type="text" {...register('phone', {required: 'Trường này không được để trống', pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g, message: 'Sai định dạng số điện thoại' }})} id="phone" className='border border-gray-300 rounded px-3 py-2 w-full outline-none' placeholder='Số điện thoại của bạn' />
                {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
            </div>
            <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                    <p className='block font-semibold mb-1 leading-none'>Mã Gift Code:</p>
                    <button type="button" onClick={()=>append({value: ''})} className='text-2xl ml-1 rounded text-white hover:shadow-[inset_0_0_0_100px_rgba(0,0,0,0.2)] duration-150 flex items-center'>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M450-280h60v-170h170v-60H510v-170h-60v170H280v60h170v170ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" /></svg>
                    </button>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="mb-1">
                        <div className="flex relative">
                            <input type="text" {...register(`code.${index}.value` as const, {required: 'Trường này không được để trống'})} id={`code.${index}`} className='border border-gray-300 rounded px-3 py-2 w-full outline-none' placeholder='Mã gift code của bạn' />
                            {fields.length > 1 && <svg onClick={()=>remove(index)} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="hover:fill-red-500 w-6 h-6 duration-150 cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>}
                        </div>
                        {errors.code?.[index]?.value && <p className='text-red-500 text-sm mt-1'>{errors.code?.[index]?.value?.message}</p>}
                    </div>
                ))}
            </div>
            <button disabled={isLoading} type="submit" className={`${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1f3d3d]'} text-white items-center leading-none px-3 py-2 rounded mx-auto hover:shadow-[inset_0_0_0_100px_rgba(0,0,0,0.2)] duration-150 flex`}>
                <span>Gửi</span>
                <svg className={`${isLoading ? 'w-5 ml-2 scale-100' : 'w-0 ml-0 scale-0'} duration-75 ease-linear h-5`} version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xmlSpace="preserve">
                    <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                    </path>
                </svg>
            </button>
        </form>
        <Popup isOpen={isPopupOpen} onClose={()=>setIsPopupOpen(false)} closeBtn="Đóng" title={popupContent.title}>
            <div className=''>
                {popupContent.content}
            </div>
        </Popup>
    </div>
    );
}

export default FormRedeem;