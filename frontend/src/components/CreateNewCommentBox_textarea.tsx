// Comment textarea box with submit & cancel button
// - also does validation
// Using React-bootstrap / Formik / Yum
// Similar to Formik but React-bootstrap does most of the styles for you
// - collected & modified from React-bootstrap doc under form validaion section

import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import { useAppDispatch } from "../models/hooks";
import { post_createComments_action } from "../models/reducers/comments_slice";
import { createComment_dispatch_type } from "../types/comments_type";
import { messageToast_actions } from "../models/reducers/messageToast_slice";
import catchHandlerForReduxSlices from "../helpers/catchHandlerForReduxSlices";

type Props = {
  setShowCreateCommentBox: Function;
  auth0UserObject: any;
  ticket_id: string;
};

export default function CreateNewCommentBox_textarea({
  setShowCreateCommentBox,
  auth0UserObject,
  ticket_id,
}: Props) {
  const dispatch = useAppDispatch();

  // handle validation from Yum
  const schema = yup.object().shape({
    createComment: yup
      .string()
      .required("iK optionally you can leave a invalid message to user here"),
  });

  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        createComment: "",
      }}
      onSubmit={(values) => {
        // setup the created comment to the comment object
        const commentObject: createComment_dispatch_type = {
          ticket_id: ticket_id,
          name: auth0UserObject?.nickname,
          email: auth0UserObject.email,
          text_comment: values.createComment,
        };

        // dispatch to create a new comment on ss psql
        dispatch(post_createComments_action(commentObject))
          .then((res) => {
            // if created comment was a fail
            if (res.type === "post/createComment/rejected") {
              // close comment box
              setShowCreateCommentBox(false);

              // message toast
              dispatch(
                messageToast_actions(
                  "Unfortunately comment was not created, please refresh the page and try again!"
                )
              );

              // display handle catch on console
              catchHandlerForReduxSlices(
                "post_createComments_action()",
                "CreateNewCommentBox_textarea.tsx",
                res
              );
            } //END of if statement post/createComment/rejected

            // if created commented was a success
            if (res.type === "post/createComment/fulfilled") {
              // close comment box
              setShowCreateCommentBox(false);
            }
          }) //END of post_createComments_action() thenable handler
          .catch((err) => {
            // close comment box
            setShowCreateCommentBox(false);

            // message toast
            dispatch(
              messageToast_actions(
                "Unfortunately comment was not created, please refresh the page and try again!"
              )
            );

            // display handle catch on console
            catchHandlerForReduxSlices(
              "post_createComments_action()",
              "CreateNewCommentBox_textarea.tsx",
              err
            );
          });
      }} //END of onSubmit event handler
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        // return form jsx component
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group style={{ position: "relative" }}>
            {/* is a controlled form */}
            <Form.Control
              as="textarea"
              name="createComment"
              value={values.createComment}
              onChange={handleChange}
              isInvalid={!!errors.createComment}
              placeholder="Enter comment"
            />
            {/* will display to user their input in the textarea is invalid */}
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.createComment}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit">Add comment</Button>
          <Button onClick={() => setShowCreateCommentBox(false)}>Cancel</Button>
        </Form>
      )}
    </Formik>
  );
}