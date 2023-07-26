export interface ILoginData {
  user: string;
  countrycode: string;
  otp: string;
}

export interface IRegisterData {
  digits_reg_name?: string;
  digits_reg_countrycode: string;
  digits_reg_mobile: string;
  otp: string;
}

interface IResponse {
  success: boolean;
}

export interface IRegisterResponse extends IResponse {
  data: {
    user_id: string;
    access_token: string;
    token_type: string;
  };
}

export interface ILoginResponse extends IResponse {
  data: {
    access_token: string;
  };
}

export interface IOtpData {
  countrycode: string;
  mobileNo: string;
  type: "login" | "register";
}

export interface IAuthError {
    code: string;
    message: string;
}

export interface ICheckMobResponse extends IResponse {
  data: {
    message?: string;
  };
}