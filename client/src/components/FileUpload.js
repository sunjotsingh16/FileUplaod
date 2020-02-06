import React, {Fragment, useState} from 'react';
import axios from "axios";
import Message from "./Message";
import ProgressBar from "./Progress";

const FileUpload = () => {

    const [file, setFile] = useState("");
    const [filename, setFilename] = useState("Choose File");
    const [uploaded, setUploaded] = useState({});
    const [message, setMessage] = useState("");
    const [uploadPercent, setUploadPercent] = useState(0);



    const onChange = e => {
        setFile(e.target.files[0]);

        setFilename(e.target.files[0].name);
    }

    const onSubmit = async e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: progressEvent => {
                    setUploadPercent(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total )));

                    // Clear percent
                setTimeout(() => setUploadPercent(0), 10000);
                }

                
            });

            const { fileName, filePath } = res.data;

            setUploaded({ fileName, filePath});

            setMessage(" File Uploaded !!");

        } catch (err) {
            if (err.response.status === 500) {
                setMessage("There was a problem with the server");
            }
            else {
                setMessage(err.response.data.msg);
            }
        }
    }

    return (
        <Fragment>
            { message ? <Message msg={message} /> : null}
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-4">
                <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                <label className="custom-file-label" htmlFor="customFile">{filename}</label>
                </div>

            <ProgressBar percent={uploadPercent} />

                <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
            </form>
            { uploaded ? <div className="row mt-5">
                <div className="col-md-6 m-auto">
                <h3 className="text-center">{uploaded.fileName}</h3>
                <img src={uploaded.filePath} style={{ width: "100%" }} alt="" />
                </div>
            </div> : null}
        </Fragment>
    )
}

export default FileUpload;
