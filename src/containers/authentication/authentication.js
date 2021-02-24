import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Import Styles
import * as styled from "./authentication.style";

// Import actions
import { postLocalSettings } from "../../redux/actions/local_actions";

// Import components
import SignInUpPage from "../../components/sign_in_up_page/sign_in_up_page";

// Import Auth from Amplify
import { Auth } from "aws-amplify";

/**
 * After the APIs have been loaded in the api_container this container is loaded
 * It checks to see if the user has already signed in based on whether or not a refresh token exists in cookies
 * If there is a token, it uses that to get a new JWT and uses that to make sure the session is valid, no reason to sign in if there's a valid session.
 * If the refresh token is expired, you have to sign in again
 * If there is no token, the user either has to sign in or sign up
 * Authenticated props is used for telling APP.js the user is authenticated
 *
 * TODO: Should show loading when there is a refresh token and its being used to get new JWT credntials
 * TODO: Styling updates
 * TODO: Forgot password
 * TODO: Add HTTPS connection to server which allows for the use of a secure cookie. Increases security a lot
 * @param {authenticated} props
 */
const Authentication = (props) => {
  const { authenticated } = props;

  const dispatch = useDispatch();

  const dispatchPostLocalSettings = (settings) =>
    dispatch(postLocalSettings(settings));
  const localReducer = useSelector((state) => state.localReducer.localSettings);

  const [signIn, setSignIn] = useState(true);

  const [user, setUser] = useState(null);

  const handleSignInChange = (value) => {
    setSignIn(value);
  };

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user);
    setUser(user);
  }

  const handleInitialLoad = () => {
    if (user) {
      dispatchPostLocalSettings({
        ...localReducer,
        authenticated: true,
      });
    }

    return (
      <styled.Container>
        <styled.LogoContainer>
          <styled.LogoIcon className="icon-rmLogo" />
          <styled.LogoSubtitle> Studio</styled.LogoSubtitle>
        </styled.LogoContainer>

        <styled.LogoWelcome> Wecome Back </styled.LogoWelcome>

        <styled.CheckBoxWrapper>
          <styled.Button
            onClick={() => setSignIn(true)}
            style={{
              backgroundColor: signIn ? "#FF4B4B" : "black",
            }}
          >
            Sign In
          </styled.Button>

          <styled.Button
            onClick={() => setSignIn(false)}
            style={{
              backgroundColor: !signIn ? "#FF4B4B" : "black",
            }}
          >
            Sign Up
          </styled.Button>
        </styled.CheckBoxWrapper>

        <styled.SignInUpContainer>
          <SignInUpPage signIn={signIn} onChange={handleSignInChange} />
        </styled.SignInUpContainer>
      </styled.Container>
    );
  };

  return handleInitialLoad();
};

export default Authentication;
