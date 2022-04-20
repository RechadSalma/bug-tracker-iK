import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { get_ticketList } from "../../../controllers/ticketsFetch";
import {
  dictionary_ticketsState_type,
  TicketsState_type,
} from "../../../@types/TicketSlice_types";

// fetch all ticket list to insert into redux 'tickets' reducer
export const get_ticketList_actions = createAsyncThunk(
  "get/ticketList",
  async (par, thunkAPI) => {
    return get_ticketList()
      .then((data) => {
        // console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
        return thunkAPI.rejectWithValue(
          "Error occured with get_ticketList_action function"
        );
      });
  }
);

// Define the initial state using that type
const initialState: dictionary_ticketsState_type = {
  null: {
    ticket_id: null,
    title: null,
    description: null,
    submitted_by: null,
    priority: null,
    assigned_user: null,
    status: null,
    app_name: null,
    app_version: null,
    created_on: null,
  },
};

export const ticketSlice = createSlice({
  name: "tickets",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // * get_ticketList_actions function
      // collect all ticket list within redux as dictionary, so ticket id will be the property name for quicker access
      .addCase(get_ticketList_actions.fulfilled, (state, actions) => {
        // console.log(actions.payload);
        const { success, data } = actions.payload;

        // do not set state if success property (from SS response) returns false
        if (!success) return;

        // create a new immuntable state object with all the ticketlist
        const newDictionary_ticketsState: dictionary_ticketsState_type = {};

        for (let item of data) {
          // console.log(item);
          newDictionary_ticketsState[item.ticket_id] = {
            ticket_id: item.ticket_id,
            title: item.title,
            description: item.description,
            submitted_by: item.submitted_by,
            priority: item.priority,
            assigned_user: item.assigned_user,
            status: item.status,
            app_name: item.app_name,
            app_version: item.app_version,
            created_on: item.created_on,
          };
        }

        return newDictionary_ticketsState;
      })

      // return nothing if request fail
      .addCase(get_ticketList_actions.rejected, (state, actions) => {
        console.log(actions.payload);
      });
  },
});

// export all actions
// export const { fetchAllTickets_actions } = ticketSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default ticketSlice.reducer;
