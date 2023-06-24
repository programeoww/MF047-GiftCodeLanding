import FormAuth from './components/FormAuth'
import FormRedeem from './components/FormRedeem'
import InitialData from './interfaces/initialData'

function App({ initialData }: {initialData: InitialData}) {

  return (
    <main className=''>
    {
      initialData?.bg_image && <img src={initialData.bg_image} alt="background" />
    }
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gradient-to-tl from-[#4D9662] to-[#2C5738] min-h-screen flex flex-col justify-start lg:justify-center">
      <div className='mx-auto w-full max-w-sm p-3'>
        <div className="relative w-32 h-24 mx-auto">
          <img src={initialData?.logo} alt="logo" className="mx-auto object-contain" />
        </div>
        {
          initialData.is_logged_in ? <FormRedeem redirectUrl={initialData.redirectUrl}/> : <FormAuth firebaseConfig={initialData.firebaseConfig}/>
        }
      </div>
    </div>
  </main>
  )
}

export default App
