import btnstyle from "./testButton.css";
function TestBtn({text, id, className, clicked}) {
    return(
        <a href="#" className={className} onClick={clicked} id={id}>{text}</a>
    )
}

export default TestBtn;