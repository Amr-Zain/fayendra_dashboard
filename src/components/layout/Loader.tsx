import LoadingJson from '@/assets/icons/animated/loading.json'
import { cn } from '@/lib/utils'
import Lottie from 'lottie-react'

function LoaderPage() {

  return (
    <div
      className={cn(
    //     'screen_loader bg-dark fixed inset-0 z-[60] grid place-content-center animate__animated ',
    //     state === 'expanded'
    //       ? 'me-0 md:ms-[var(--sidebar-width)]'
    //       : 'me-0 md:ms-[var(--sidebar-width-icon)]',
    //  
     )}
    >
      <Lottie
        className="size-80 mx-auto mt-50"
        animationData={LoadingJson}
        loop={true}
      />
    </div>
  )
}

export default LoaderPage
