import { loaderContainer, loader } from './styles/loading.css'

export default function Loading() {
  return (
    <div className={loaderContainer}>
      <div className={loader}></div>
    </div>
  )
}