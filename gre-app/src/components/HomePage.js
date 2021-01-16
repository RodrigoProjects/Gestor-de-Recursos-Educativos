import NavbarComp from "./NavbarComp.js"
import NewsComp from "./NewsComp.js"
import LoginRegisterComp from "./LoginRegisterComp.js"
import "../stylesheets/homepage.css"

export default function HomePage(props){
    return(
        <>
            <NavbarComp />
            <div className="index-content">
                <LoginRegisterComp />
                <NewsComp />
            </div>
        </>
    )
}