import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { Formik, Form } from "formik";

// Import Utils
import { signInSchema, signUpSchema } from "../../methods/utils/form_schemas";

// Import Components
import TextField from "../basic/form/text_field/text_field";
import Textbox from "../basic/textbox/textbox";

import * as styled from "./sign_in_up_page.style";

// Import actions
import { postLocalSettings } from "../../redux/actions/local_actions";

// Get Auth from amplify
import { Auth } from "aws-amplify";

/**
 * This page handles both sign in and sign up for RMStudio
 * @param {signIn} props
 */
const SignInUpPage = (props) => {
  // signIn prop is passed from authentication container to tell this page to show sign in or sign up components
  const { signIn } = props;

  // Redux for cookies
  const dispatch = useDispatch();
  const dispatchPostLocalSettings = (settings) =>
    dispatch(postLocalSettings(settings));
  const localReducer = useSelector((state) => state.localReducer.localSettings);

  function handleSignInChange(event) {
    props.onChange(event);
  }

  async function signIntoApp(username, password) {
    try {
      await Auth.signIn(username, password);

      dispatchPostLocalSettings({
        ...localReducer,
        authenticated: true,
      });
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  async function signUp(username, password) {
    const email = username;
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });

      alert(
        "You have sucessfully signed up. Please check your email for a verification link."
      );
      handleSignInChange(true);
    } catch (error) {
      console.log("error signing up:", error);
      alert(error.message);
    }
  }

  const handleSubmit = (values) => {
    const { email, password } = values;

    // If the request is a sign in then run these functions
    if (signIn) {
      signIntoApp(email, password);
    } else {
      signUp(email, password);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
      }}
      initialTouched={{
        email: true,
        password: true,
        confirmPassword: true,
      }}
      validateOnBlur={false}
      validateOnChange={false}
      // Chooses what schema to use based on whether it's a sign in or sign up
      // TODO: The schemas are not 100% working as of 9/14/2020. Need to figure out regex for passwords
      validationSchema={signIn ? signInSchema : signUpSchema}
      onSubmit={async (values, { setSubmitting }) => {
        console.log("QQQQ Submiting", values);

        setSubmitting(true);

        await handleSubmit(values);

        setSubmitting(false);
      }}
    >
      {(formikProps) => {
        return (
          <Form>
            <TextField
              name={"email"}
              placeholder="Enter Email"
              type="text"
              InputComponent={Textbox}
              style={{
                margin: "1rem",
                height: "3rem",
              }}
            />

            <TextField
              name={"password"}
              placeholder="Enter Password"
              type="password"
              InputComponent={Textbox}
              style={{
                margin: "1rem",
                height: "3rem",
              }}
            />

            {/* If sign in hasn't been selected show a confirm password for sign up */}
            {!signIn && (
              <TextField
                name={"confirmPassword"}
                placeholder="Enter Password"
                type="password"
                InputComponent={Textbox}
                style={{
                  margin: "1rem",
                  height: "3rem",
                }}
              />
            )}

            <styled.Container>
              <styled.Button type="submit">
                {signIn ? "Sign In" : "Sign Up"}
              </styled.Button>
            </styled.Container>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SignInUpPage;
