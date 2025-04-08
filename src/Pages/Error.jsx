import { useEffect, useState } from "react"

export default function Error({ ErrorCode }) {
    const [ErrorText, setErrorText] = useState('')

    useEffect(() => {
        switch (ErrorCode) {
            case 403:
                setErrorText('Sorry, you are not allowed to be here')
                break
            case 404:
                setErrorText('Sorry, we couldn\'t find this page')
                break
            default:
                setErrorText('An unknown error occurred')
        }
    }, [ErrorCode])

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center p-4">
            {
                ErrorCode &&
                <h1 className="text-9xl font-extrabold">{ErrorCode}</h1>
            }
            <h2 className="text-3xl text-center">{ErrorText}</h2>
        </div>
    )
}
