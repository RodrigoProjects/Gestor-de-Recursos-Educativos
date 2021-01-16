import { FaNewspaper } from "react-icons/fa";


export default function NewsComp(props){
    return(
        <>
            <div className="news-content">
                <div className="card">
                    <div className="card-icon">
                        <FaNewspaper size={50}/>
                    </div>
                    <div className="card-body text-dark text-center mt-3">

                    </div>

                </div>
            </div>
        </>
    )
}