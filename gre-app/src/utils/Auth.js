import { Redirect } from "react-router";


export default function Auth(props){
    console.log(props.authorized())
    return( 
        <>
            {props.authorized ? props.comp : <Redirect to="/" />}
        </>
    )
}