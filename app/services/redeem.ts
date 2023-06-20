import axios from 'axios';

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

export default async function redeem(redeemData: redeemData) {
    const { data } = await axios.post<redeemResponse>(`${process.env.NEXT_PUBLIC_API_URL}/redeem`, redeemData);
    
    return data;
}