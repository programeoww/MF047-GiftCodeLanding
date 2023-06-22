import axios from "axios";
import { IAuthError, ICheckMobResponse, ILoginData, ILoginResponse, IOtpData, IRegisterData, IRegisterResponse } from "../interfaces/auth";
import { ConfirmationResult, UserCredential } from "firebase/auth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_DOMAIN,
});

const createFormData = (data: object) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

export async function registerUser(registerData: IRegisterData) : Promise<IRegisterResponse> {
  registerData.digits_reg_mobile = registerData.digits_reg_mobile.replace('+84', "");
  const { data } = await instance.post<IRegisterResponse>(`/wp-json/digits/v1/create_user`, createFormData(registerData));
  return data;
}

export async function loginUser(loginData: ILoginData) : Promise<ILoginResponse> {
  loginData.user = loginData.user.replace('+84', "");
  const { data } = await instance.post<ILoginResponse>(`/wp-json/digits/v1/login_user`, createFormData(loginData));
  return data;
}

export async function send_otp(otpData: IOtpData) {
  otpData.mobileNo = otpData.mobileNo.replace('+84', "");
  const { data } = await instance.post<never>(`/wp-json/digits/v1/send_otp`, createFormData(otpData));
  return data;
}

export async function check_mob(mobileNo: string, type: string) : Promise<ICheckMobResponse> {
  const { data } = await instance.post<ICheckMobResponse>(`/wp-json/gift-code/v1/check_mob`, createFormData({mobileNo: mobileNo.replace('+84', ""), countrycode: '+84', type: type}));
  return data;
}

export async function verifyOtp(confirmationResult: ConfirmationResult, otp: string, mobileNo: string, type: string ): Promise<{ success: boolean, message: string, code: string | number }> {
  if(confirmationResult && otp && mobileNo && type){
      try {
          mobileNo = mobileNo.replace('+84', "");
          const result: UserCredential = await confirmationResult.confirm(otp)
          const idToken: string = await result.user.getIdToken()
          const { data } = await instance.post<{code: string | number}>(`/wp-json/digits/v1/verify_otp`, createFormData({countrycode: '+84', mobileNo: mobileNo, otp: otp, type: type, dig_ftoken: idToken}));
          if(data.code == 1){
            return { success: true, message: idToken, code: 'success' }
          }else{
            return { success: false, message: "Xác thực OTP thất bại", code: data.code }
          }
      } catch (error) {
          return { success: false, message: (error as IAuthError).message, code: (error as IAuthError).code }
      }
  }
  return { success: false, message: "Có lỗi xảy ra", code: 'unknown' }
}