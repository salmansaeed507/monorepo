import axios from "axios"
import { ChangeEvent, useState } from "react"
import { Button, Image } from "react-bootstrap"
import { getToken } from "../authFunc"
import { UploadedFile } from "../types/uploaded-file.interface"

export function UploadImage(props: any) {

    const [image, setImage] = useState<UploadedFile>({})

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) {
            return false;
        }
        uploadImage(file).then((data) => {
            setImage(data?.data as UploadedFile)
            props.onChange && props.onChange(data?.data)
        })
        
    }

    function uploadImage(file: any) {
        return axios.post(process.env.REACT_APP_BASE_URI+"upload/image",{ file },{
            headers: {
                "Content-type": "multipart/form-data",
                "Authorization": "Bearer " + getToken()
            }
        })
        .catch(e => {
            alert("There was some issue while uploading file")
            console.log(e)
        })
    }

    function handleRemove() {
        axios.delete(process.env.REACT_APP_BASE_URI+"upload", {
            headers: {
                "Authorization": "Bearer " + getToken()
            },
            data:{
                file: image.filename
            }
        })
        .then((data) => {
            setImage({})
        })
        .catch(e => {
            alert("There was some issue while deleting file")
            console.log(e)
        })
    }

    return (
        <>
            {
                image.url ?
                <>
                    <p><Image src={image.url} style={{width:"200px", height: "200px"}}/></p>
                    <p><Button onClick={handleRemove}>Remove</Button></p>
                </> :
                <>
                    <input type="file" onChange={(e) => handleChange(e)}/> 
                </>
            }
        </>
    )
}