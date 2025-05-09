import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const clientId = "901238362479-qhi62371a9f08ma2jmlmbh1vbctruivj.apps.googleusercontent.com";

//Google Api login
const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.client.init({
          clientId: clientId,
          scope: "https://www.googleapis.com/auth/classroom.courses.readonly",
        });
      });
    };
    initClient();
  }, []);

  const handleGoogleLogin = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then((googleUser) => {
      const token = googleUser.getAuthResponse().access_token;

      fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("token", token);
          navigate("/home");
        })
        .catch((error) => console.error("Error:", error));
    });
  };


  //Manual Login and register
  const handleManualLogin = (e) => {
    e.preventDefault();

    const endpoint = isRegistering
      ? "https://pims-d.onrender.com/auth/register"
      : "https://pims-d.onrender.com/auth/manual";

    const payload = isRegistering
      ? { name, email, password }
      : { email, password };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token || data.success) {
          if (data.token) {
            localStorage.setItem("token", data.token);
            navigate("/home");
          } else {
            alert("Registration successful. Please log in.");
            setIsRegistering(false);
            setName("");
            setEmail("");
            setPassword("");
          }
        } else {
          alert(data.message || "Something went wrong.");
        }
      })
      .catch((error) => console.error("Auth error:", error));
  };

  return (
    <div className="box">
      <div className="Logo"></div>
      <h2>{isRegistering ? "Register" : "Login"}</h2>

      {/* Manual Login/Register Form */}
      <form onSubmit={handleManualLogin}>
        {isRegistering && (
          <div className="input">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              //style={{ display: "block", width: "100%", marginBottom: "10px" }}
            />
          </div>
        )}
        <div className="input">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            //style={{ display: "block", width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div className="input">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            //style={{ display: "block", width: "100%", marginBottom: "10px" }}
          />
        </div>
        <button className="button">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <button onClick={handleGoogleLogin} className="GoogleButton" type="submit">
        <div className="GoogleImage"></div>
        <div className="Google">Google</div>
      </button>

      <p className="BottomPart">
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          //style={{ background: "none", color: "black", border: "none", cursor: "pointer" }}
        >
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default Login;
