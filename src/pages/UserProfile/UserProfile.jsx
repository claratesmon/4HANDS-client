import "./UserProfile.css";
import { useEffect, useState } from "react";
import { useNavigate, Navigate, redirect, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { useContext } from "react";



function UserProfile() {
    const navigate = useNavigate();
    const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
    const { userId } = useParams();
    const userIdFromAuth = user._id
    const [userData, setUserData] = useState('')
    const BACKEND_ROOT = import.meta.env.VITE_SERVER_URL;

    const isMe = () => {
        if (user._id === userIdFromAuth) {
            return true;
        }
        else {
            return false;
        }
    }

    useEffect(() => {
        fetch(`${BACKEND_ROOT}/user/${userId}`)
            .then((response) => {
                return response.json();
            })
            .then((jsonData) => {
                setUserData(jsonData);
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <>
            {userData && !isMe() ? navigate("/myprofile") : (
                <div>
                     <div className="profile-container">
                        <div className="profile-card">

                            <div className="user-details-picture-responsive">
                                <div className="profile-picture-container">
                                    <img className="user-profilepicture" src={userData.profilePicture} alt={userData.name} />
                                </div>

                                <div className="user-details-container">
                                    <div className="user-details-responsive">

                                        <h2 className="user-name">{userData.name}</h2>
                                        <div className="location-container">
                                            <h4>Location:</h4>
                                            <p>{userData.location}    <i className="fa fa-map-marker"></i></p>
                                        </div>
                                        <div className="skills-container">
                                            <h4 className="skills-title">Skills:</h4>
                                            <p> {userData.skills}</p>
                                        </div>
                                        
                                        <div className="skills-container">
                                            <h4 className="skills-title">Contact:</h4>
                                            <p>E-Mail: {userData.email}</p>
                                            {userData.phone ? (<p>Tel.: {userData.phone}</p>) : (<></>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
        </>);
}

export default UserProfile;