import AboutUsPage from "@/app/despre-noi/AboutUsPage";
import HomePage from "@/app/page";
import TeamPage from "@/app/echipa/TeamPage";
import type { ReactNode } from "react";

interface RoutesI {
    name: string,
    title: string,
    path: string,
    element: ReactNode,
    hideNavbar?:boolean,
    hideFooter?:boolean
}

 export const  routes:RoutesI[] = [
    {
        name:'Home',
        title:'MainPage',
        path:'/',
        element: <HomePage/>
    },
    {
        name:'AboutUs',
        title:'Secondpage',
        path:'/despre-noi',
        element:<AboutUsPage/>,
        hideFooter:true
    },
    {
        name:'Team',
        title:'Teampage',
        path:'/echipa',
        element:<TeamPage/>, 
        hideNavbar:true 
    }
 ]