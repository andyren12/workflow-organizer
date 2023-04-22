import { GoogleLogin } from './GoogleLogin'
import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { v4 as uuidv4 } from 'uuid'
import styles from "./Projects.module.scss"

export default function Projects() {
    const { supabase, user } = GoogleLogin();
    const [images, setImages] = useState([]);
    const [playing, setPlaying] = useState(false);

    const CDNURL = "https://xpdqyzszorntzkrorvdx.supabase.co/storage/v1/object/public/Project%20files/";

    async function getImages() {
        const { data, error } = await supabase
            .storage
            .from('Project files')
            .list(user?.id + "/", {
                limit: 100,
                offset: 0,
                sortBy: { column: "name", order: "asc" }
            });
        
            if(data !== null) {
                setImages(data);
            } else {
                console.log(error);
            }
    }

    async function uploadImage(e) {
        let file = e.target.files[0];
        const { data, error } = await supabase
            .storage
            .from('Project files')
            .upload(user.id + "/" + uuidv4(), file)

        if(data) {
            getImages();
        } else {
            console.log(error);
        }
    }

    async function deleteImage(imageName) {
        const { error } = await supabase
        .storage
        .from('Project files')
        .remove([user.id + "/" + imageName])

        if(error) {
            alert(error);
        } else {
            getImages();
        }
    }

    useEffect(() => {
        if(user) {
            getImages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className={styles.main}>
            <form style={{width: "220px"}}>
                <input type="file" accept="image/png, image/jpg, video/mp4" onChange={(e) => uploadImage(e)}/>
            </form>
            <div>
                {images.map((image) => {
                    return (
                        <div>
                            <div>
                                <ReactPlayer url={CDNURL + user.id + "/" + image.name} playing={playing} />
                                <button onClick={() => { setPlaying(true) }}>Play</button>
                                <div>
                                    <button variant="danger" onClick={() => deleteImage(image.name)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

