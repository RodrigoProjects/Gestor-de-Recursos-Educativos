import { Redirect } from "react-router";


export default function Auth(props){
    return( 
        <>
            {props.authorized() ? props.comp : <Redirect to="/" />}
        </>
    )
}