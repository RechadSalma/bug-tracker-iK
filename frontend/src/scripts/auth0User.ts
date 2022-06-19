// auth0 user function for more DRY convient in accessing user object from the useAuth0() hook function
//eg. auth0User(iKcallback1, iKcallback2)
//eg. auth0User(() => {...}, user => {...})

import { useAuth0, User } from "@auth0/auth0-react";

// function type to return loading element or whatever while auth0 is loading or unauthenticated
interface loadingCallback_type {
  (): unknown;
}

export default function auth0User(
  // do something while auth0 is loading or unauthenticated with this callback parameter
  loadingCallback: loadingCallback_type,
  // do something with the auth0 user object with this callback parameter
  authenticatedCallback: (user: any) => any
) {
  const auth0 = useAuth0<User>();

  // auth0 is loading up
  if (auth0.isLoading) return loadingCallback();

  // user is authenticated or not
  if (auth0.isAuthenticated) {
    const { user } = auth0;
    // console.log("🚀 ~ file: auth0User.ts ~ line 27 ~ user", user);

    // callback has access to the user object now
    return authenticatedCallback(user);
  }
  // user is unauthenticated
  else {
    return loadingCallback();
  }
}

/** eg. auth0User function callback
  const testing = auth0User(
    () => <div>...Loading</div>,
    (user) => <div>{user.email}</div>
  );

* or eg. return just the user object
  const auth0UserObject = auth0User(
    () => null,
    (user) => user
  );
*/
