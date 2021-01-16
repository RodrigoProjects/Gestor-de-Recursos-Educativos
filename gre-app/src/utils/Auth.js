import { Redirect } from "react-router";


export default function Auth(props){
    return( 
        <>
            {(props.auth() && props.comp) || <Redirect to="/" />}
        </>
    )
}