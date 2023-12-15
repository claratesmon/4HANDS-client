import "./EditHelpPage.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from "../../context/auth.context";
import service from "../../services/file-upload.service";

function EditHelpForm() {
    const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
    const [helpPut, setHelpPut] = useState('')
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [helpImageUrl, setHelpImage] = useState('')
    const [isCompleted, setIsCompleted] = useState('')
    const { helpId } = useParams()
    const navigate = useNavigate();

    const handleFileUpload = (e) => {
        //console.log("The file to be uploaded is: ", e.target.files);
        
        const uploadData = new FormData();
        
        uploadData.append('helpImageUrl', e.target.files[0]);
        
        console.log("UploadData", uploadData);
        service
            .uploadImage(uploadData)
            .then(response => {
                // console.log("response is: ", response);
                // response carries "fileUrl" which we can use to update the state
                setHelpImage(response.fileUrl);
            })
            .catch(err => console.log("Error while uploading the file: ", err));
    };

    useEffect(() => {

        const BACKEND_ROOT = import.meta.env.VITE_SERVER_URL;
        fetch(`${BACKEND_ROOT}/help-post/${helpId}`, { mode: 'cors' })

            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                const { location, helpImageUrl, title, description } = responseJson.foundHelpPost
                setLocation(location)
                setHelpImage(helpImageUrl)
                setTitle(title)
                setDescription(description)
                //console.log("este es el responseJson", responseJson.foundHelpPost)
            })
            .catch((err) => console.log(err))
    }, [])


    const putHelp = async (event) => {
        event.preventDefault();
        const newHelpPut = {
            title,
            location,
            description,
            helpImageUrl,
            isCompleted
        };
        //console.log(helpPut);

        try {
            const BACKEND_ROOT = import.meta.env.VITE_SERVER_URL;
            const response = await fetch(`${BACKEND_ROOT}/help-post/edithelp/${helpId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newHelpPut),
            }
                , { mode: 'cors' });

            const responseJson = await response.json();
            setHelpPut(responseJson)
            navigate(`/help-post/${helpId}`)
            console.log("helpPutjson", responseJson);

        } catch (err) {
            console.log(err);
        }
    }



    return (
        <div>
            <h1>Edit Help Request</h1>



            <div className="edit-help-container">
                <form className="create-help-container" onSubmit={(event) => putHelp(event)}>

                    <label htmlFor="title">Title</label>
                    <textarea value={title} onChange={(event) => setTitle(event.target.value)} type="text" name="title" />

                    <label htmlFor="Location">Location</label>
                    <textarea value={location} onChange={(event) => setLocation(event.target.value)} type="text" name="location" />

                    <label htmlFor="Description">Description</label>
                    <textarea value={description} onChange={(event) => setDescription(event.target.value)} type="textarea" name="description" />

                    <label htmlFor="helpImageUrl">Image</label>
                    <input type="file" accept="image/*" className="image-input"
                        
                        onChange={(event) => handleFileUpload(event)}
                        name="helpImageUrl"
                        id="helpImageUrl" />
                    {helpImageUrl && <img className="img-preview" src={helpImageUrl} alt="Help Image" />}

                    <p onClick={(event) => putHelp(event)} className="create-help-button" type="submit">SAVE CHANGES</p>
                </form>
            </div>
        </div>
    );
}


export default EditHelpForm;