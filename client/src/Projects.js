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
                sortBy: { column: "created_at", order: "asc" }
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
            <div className={styles.head}>
                <input id="file-upload" type="file" accept="video/mp4" onChange={(e) => uploadImage(e)}/>
                <label htmlFor="file-upload">
                    <div className={styles.uploadButton}>
                        Upload
                    </div>
                </label>
                <h2 className={styles.headText}>Your Media <hr /></h2>
            </div>
            <div className={styles.images}>
                    {images.map((image) => {
                        return (
                            <div key={image.name} className={styles.imageCard}>
                                <ReactPlayer url={CDNURL + user.id + "/" + image.name} playing={playing} width='360px' height='270px'/>
                                <button onClick={() => { setPlaying(true) }}>Play</button>
                                <button onClick={() => deleteImage(image.name)}>Delete</button>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

