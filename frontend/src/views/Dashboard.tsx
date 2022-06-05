import React, { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer"; // import "bootstrap/js/dist/toast";
// import * as bootstrap from "bootstrap";

import LogoutButton from "../components/LogoutButton";
import Profile from "../components/Profiles";
import HomeLogin from "../components/HomeLogin";
import { Link } from "react-router-dom";
import SeoReactHelmet from "../components/SeoReactHelmet";
import { useAuth0, User } from "@auth0/auth0-react";
import isAdmin_hook from "../helpers/isAdmin_hook";
import auth0User from "../helpers/auth0User";
import { useAppDispatch, useAppSelector } from "../models/hooks";
import Ticket_anchorLinkToTicket from "../components/Ticket_anchorLinkToTicket";
import {
  messageToast_actions,
  nullTheMessageToast_actions,
} from "../models/reducers/messageToast_slice";
import Message_toast from "../components/Message_toast";
import DisplayAssignedTicketsList_table from "../components/DisplayAssignedTicketsList_table";
import { ticket_type } from "../types/tickets_type";
import DisplaySubmittedTicketsList_table from "../components/DisplaySubmittedTicketsList_table";
import BackToTop_link from "../components/BackToTop_link";
import { Container } from "react-bootstrap";

export default function Dashboard(): JSX.Element {
  const auth0UserObject = auth0User(
    () => null,
    (userObject) => userObject
  );

  // Array of tickets that user is assigned (assigned_user) to only
  // use for passing to DisplayAssignedTicketsList_table component props
  const userAssignedTickets_array: Array<ticket_type> = [];

  // Array of tickets that user is sumbitted (submitted_by) to only
  // use for passing to DisplaySubmittedTicketsList_table component props
  const userSubmittedTickets_array: Array<ticket_type> = [];

  // cycle through the tickets to get user assigned & submitted tickets
  // remember the state ticket is an object with property name of ticket_id, which than finally contain the ticket object
  useAppSelector((state) => {
    // removing the object wrapper container the property name of ticket_id & converting it straightup into a array of ticket objects
    const ticketsList_array = Object.values(state.tickets);

    ticketsList_array.forEach((ticket) => {
      // check if user is assigned to the ticket
      if (
        ticket.assigned_user?.toLowerCase() ===
        auth0UserObject.nickname?.toLowerCase()
      ) {
        // place all the user assigned tickets to userAssignedTickets_array
        userAssignedTickets_array.push(ticket);
      }

      if (
        ticket.submitted_by?.toLowerCase() ===
        auth0UserObject.nickname?.toLowerCase()
      ) {
        // place all the user submitted tickets to userSubmittedTickets_array
        userSubmittedTickets_array.push(ticket);
      }
    });
  });

  const dispatch = useAppDispatch();
  const messageToast = useAppSelector((state) => state.messageToasts.message);

  // return user nickname (username) from auth0 user object
  const displayUserName = () => {
    if (auth0UserObject === null) return "...loading";

    return auth0UserObject.nickname;
  };

  return (
    <Container>
      <SeoReactHelmet
        pageTitle="Dashboard / Bug Tracker - Github user: RechadSalma | Developer: ilshaad Kheerdali"
        metaDescriptionContent="Dashboard / Bug Tracker - Dashboard - Github user: RechadSalma | Developer: ilshaad Kheerdali"
        metaKeywordsContent="Dashboard Bug Tracker RechadSalma ilshaad Kheerdali"
      />

      {/* message toast for user confirmation such as success or failure in creating a ticket */}
      <Message_toast />

      <h1 className={`text-center`}>Dashboard</h1>

      <div className="container">
        <h2>display assigned user tickets</h2>
        {/* {listOfUserAssignedTickets()} */}
        <DisplayAssignedTicketsList_table
          userAssignedTickets_array={userAssignedTickets_array}
          auth0UserObject={auth0UserObject}
        />
      </div>

      <div className="container">
        <h2>display submitted_by tickets</h2>
        {/* {listOfUserSubmittedTickets()} */}

        <DisplaySubmittedTicketsList_table
          userSubmittedTickets_array={userSubmittedTickets_array}
          auth0UserObject={auth0UserObject}
        />
      </div>

      <BackToTop_link />
    </Container>
  );
} //END Dashboard component
