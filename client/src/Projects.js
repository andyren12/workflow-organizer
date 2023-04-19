import { useState } from 'react';

export default function Projects() {
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No selected file");

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "300px" }}>
            <input type="file" onChange={({ target: {files}}) => {
                files[0] && setFileName(files[0].name)
                if (files) {
                    setImage(URL.createObjectURL(files[0]))
                }
                console.log(files);
            }}/>
            {image ? 
            <img src={image} alt={fileName} width={80} height={80}/>
            :
            <div> no image yet </div>}
            <button onClick={() => {
                setFileName("No selected file");
                setImage(null);
            }}>Delete</button>
        </div>
    )
}

