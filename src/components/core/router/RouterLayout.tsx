import type { ReactNode } from "react"
import { Footer } from "../footer/Footer"
import { Navbar } from "../header/Navbar"

interface RouterLayoutProps {
    children: ReactNode,
    hideNavbar?: boolean,
    hideFooter?: boolean
}

const RouterLayout =({children,hideFooter = false, hideNavbar = false}:RouterLayoutProps)=>{
        
    return(
        <div className="w-screen flex flex-col">
            {!hideNavbar && <Navbar/>}
            {children}
            {!hideFooter && <Footer/>}
        </div>
    )
}
export default RouterLayout