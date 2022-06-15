// delete modal will show the delete text form
// using react-bootstrap modal component
// only admin & submitted_user can delete ticket, noone else

import React from "react";
import { Modal } from "react-bootstrap";
import DeleteTicket_form from "./DeleteTicket_form";

type Props = { showModal: boolean; closeModal_function: Function };

export default function DeleteTicket_modal({
  showModal,
  closeModal_function,
}: Props) {
  return (
    <Modal
      // show modal
      show={showModal}
      // hide modal when user click outside the modal box
      onHide={() => closeModal_function(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-1 fw-bold text-primary">
          Delete Ticket
        </Modal.Title>
      </Modal.Header>

      <DeleteTicket_form closeModal_function={closeModal_function} />
      {/* <Modal.Body>
        <h4>DeleteTicket_form</h4>

        <DeleteTicket_form />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => closeModal_function(false)}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  );
}
