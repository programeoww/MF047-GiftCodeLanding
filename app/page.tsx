import axios from 'axios'
import Image from 'next/image'
import Form from './components/FormRedeem'

type IWebsiteInfo = {
  success: boolean,
  data: {
    logo: string
    bg_image?: string
  }
}

export default async function Home() {
  const { data: { data: websiteInfo } } = await axios.get<IWebsiteInfo>(`${process.env.NEXT_PUBLIC_API_URL!}/website_info`)

  return (
    <main className=''>
      {
        websiteInfo.bg_image && <Image src={websiteInfo.bg_image} alt="background" fill />
      }
      <div className="fixed z-10 inset-0 overflow-y-auto bg-gradient-to-tl from-[#4D9662] to-[#2C5738] min-h-screen flex flex-col justify-start lg:justify-center">
        <div className='mx-auto w-full max-w-sm p-3'>
          <div className="relative w-32 h-24 mx-auto">
            <Image src={websiteInfo.logo} fill alt="logo" sizes='100' priority quality={100} className="mx-auto object-contain" />
          </div>
          <Form />
        </div>
      </div>
    </main>
  )
}
