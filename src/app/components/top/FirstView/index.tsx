import { Movie } from "../../common/Movie"
import { siteTitle, firstViewContainer, titleTag, titleCode, srOnly, siteTitleInner } from "./index.css"

export const FirstView = () => {
  return (
    <div className={firstViewContainer}>
      <div className={siteTitle}>
        <div className={siteTitleInner}>
          <div className={titleTag}>J.Sato</div>
          <div className={titleCode}>Portfolio Site</div>
        </div>
      </div>
      <Movie src="/movies/top/fv.mp4" autoplay={true} />
    </div>
  )
}