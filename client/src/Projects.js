import { GoogleLogin } from './GoogleLogin'
import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { v4 as uuidv4 } from 'uuid'
import styles from './Projects.module.scss'

export default function Projects() {
    const { supabase, user } = GoogleLogin();
    const [videos, setVideos] = useState([]);

    const CDNURL = "https://xpdqyzszorntzkrorvdx.supabase.co/storage/v1/object/public/Project%20files/";

    async function getVideos() {
        const { data, error } = await supabase
            .storage
            .from('Project files')
            .list(user?.id + "/", {
                limit: 100,
                offset: 0,
                sortBy: { column: "created_at", order: "asc" }
            });
        
        if(data !== null) {
            setVideos(data);
        } else {
            console.log(error);
        }
    }

    async function uploadVideos(e) {
        let file = e.target.files[0];
        const { data, error } = await supabase
            .storage
            .from('Project files')
            .upload(user.id + "/" + uuidv4(), file)

        if(data) {
            getVideos();
        } else {
            console.log(error);
        }
    }

    async function deleteVideo(videoName) {
        const { error } = await supabase
        .storage
        .from('Project files')
        .remove([user.id + "/" + videoName])

        if(error) {
            alert(error);
        } else {
            getVideos();
        }
    }

    useEffect(() => {
        if(user) {
            getVideos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className={styles.main}>
            <div className={styles.head}>
                <input id="file-upload" type="file" accept="video/mp4" onChange={(e) => uploadVideos(e)}/>
                <label htmlFor="file-upload">
                    <div className={styles.uploadButton}>
                        Upload File
                    </div>
                </label>
                <h2 className={styles.headText}>Your Media <hr /></h2>
            </div>
            <div className={styles.videos}>
                {videos.map((video, index) => {
                    return (
                        <div className={styles.vidCard} key={video.name}>
                                <ReactPlayer url={CDNURL + user.id + "/" + video.name} controls='true' width='360px' height='270px'/>
                                <button id={styles.delButton} onClick={() => deleteVideo(video.name)}></button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

