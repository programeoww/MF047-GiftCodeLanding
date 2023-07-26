import FormAuth from './components/FormAuth'
import FormRedeem from './components/FormRedeem'
import InitialData from './interfaces/initialData'

function App({ initialData }: {initialData: InitialData}) {

  return (
    <main className='text-[#1f3d3d]'>
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gradient-to-tl from-[#1f3d3d] to-[#1f3d3d] min-h-screen flex flex-col justify-center">
      <div className='fixed left-0 right-0 -z-10 top-0 bottom-0 lg:top-auto lg:bottom-auto brightness-50'>
        {
          initialData?.bg_image && <img src={initialData.bg_image} className='object-cover w-full h-full' alt="background" />
        }
      </div>
      <div className='mx-auto w-full max-w-sm p-3'>
        <div className="relative w-32 h-24 mx-auto">
          <img src={initialData?.logo} alt="logo" className="mx-auto object-contain" />
        </div>
        {
          initialData.is_logged_in ? <FormRedeem redirectUrl={initialData.redirectUrl} userID={initialData.userID}/> : <FormAuth/>
        }
      </div>
    </div>
  </main>
  )
}

export default App
