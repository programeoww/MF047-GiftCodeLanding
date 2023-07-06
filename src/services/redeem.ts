import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_DOMAIN,
  });

type redeemData = {
    name: string,
    phone: string,
    code: {
        value: string
    }[],
}

type redeemResponse = {
    success: boolean,
    data: {
        message?: string,
        code?: {
            value: string,
            error: string
        }[]
    }
}

export default async function redeem(redeemData: redeemData, userID: string) {
    const { data } = await instance.post<redeemResponse>(`/wp-json/gift-code/v1/redeem`, {...redeemData, userID});
    
    return data;
}