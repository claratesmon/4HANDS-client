import "./Navbar.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const [userData, setUserData] = useState('')
  const { userId } = useParams()
  const BACKEND_ROOT = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const handleSidebar = () => {
    const sideBar = document.querySelector(".navbar .sidebar");
    sideBar.classList.toggle("hidden");
    if (sideBar.style.right === "0px") {
      sideBar.style.right = "-400px"
    }
  };

  const hasTokens = async () => {
    console.log(userData.tokens)
    if (userData.tokens < 1) {
      navigate("/myprofile");
      console.log("navigate called")
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const banner = document.querySelector(".no-tokens-banner")
        banner.classList.toggle("hidden");

        if (banner.style.top === "0px") {
          banner.style.top = "-300px"


        }

      } catch (error) {
        console.log("There was an error:", error)
      }

    }
  }
  const hideBanner = () => {
    const banner = document.querySelector(".no-tokens-banner");

    // Hide the banner after 5 seconds
    setTimeout(() => {
      banner.classList.add("hidden");
    }, 4000);
  };

  useEffect(() => {
    if (user) {
      fetch(`${BACKEND_ROOT}/user/${user._id}`)
        .then((response) => response.json())
        .then((responseJson) => {

          setUserData(responseJson);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="navbar-container">
      <div className="no-tokens-banner hidden">
        <p>Sorry, your are out of tokens</p>
      </div>
      <nav className="navbar">
        {isLoggedIn && (
          <>
            <Link to="/home">
              <img className="logo" src="/images/4H-2.svg" alt="" />
            </Link>
            <img className="right-button" onClick={handleSidebar} src={userData.profilePicture} alt="profile picture" />

            <div className="sidebar hidden">
              <div onClick={handleSidebar} className="center">
                <div></div>
              </div>
              <div className="sidebar-content ">
                <ul className="side-list">
                  <li >
                    <Link to="/myprofile">
                      <p onClick={handleSidebar} className="side-element">Profile</p>
                    </Link>
                  </li>
                  <li >
                    <Link to="/editprofile">
                      <p onClick={handleSidebar} className="side-element">Edit profile</p>
                    </Link>
                  </li>
                  <li >
                    <Link to="/createhelp">
                      <p onClick={(event) => {
                        handleSidebar(event);
                        if (userData.tokens < 1) {
                          event.preventDefault(); // prevent the default action
                          navigate("/myprofile");
                          hasTokens();
                          hideBanner();
                        }
                      }} className="side-element">
                        Create Help request
                    {"  "} <i class="fa fa-plus" style={{color: "white"}}></i>
                      </p>
                    </Link>
                  </li>
                  <li >
                    <Link to="/alltestimonies">
                      <p onClick={handleSidebar} className="side-element">Testimonies</p>
                    </Link>
                  </li>
                  <li >
                    <Link to="/createtestimony">
                      <p onClick={handleSidebar} className="side-element">Create testimony {"   "}
                      <i class="fa fa-plus" style={{color: "white"}}></i>
                      </p>
                    </Link>
                  </li>
                  <li>
                    <div className="sidebar-stroke">{''}</div>
                  </li>
                  <li >
                    <p onClick={logOutUser} className="side-element">Logout</p>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/">
              <img className="logo" src="/images/4H-2.svg" alt="" />
            </Link>
            <div className="nav-landing-left">
              <Link to="/signup">
                <p className="nav-b-left">Sign Up</p>
              </Link>
              <Link to="/login">
                <p className="nav-b-left">Login</p>
              </Link>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
