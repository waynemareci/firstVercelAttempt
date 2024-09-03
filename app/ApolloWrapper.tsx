"use client";

import { createHttpLink, HttpLink, makeVar } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { stringify } from "querystring";

export const starredVar = makeVar([]);

const AppWithApollo = ({ children }: React.PropsWithChildren) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading, error } =
    useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  const authLink = setContext(async (_, { headers }) => {
    // Only try to fetch access token if user is authenticated
    console.log("isAuthenticated is " + isAuthenticated ? "true" : "false")
    const accessToken = isAuthenticated
      ? await getAccessTokenSilently()
      : undefined;
      console.log("accessToken is " +  JSON.stringify(accessToken))
    if (accessToken) {
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      };
    } else {
      return {
        headers: {
          ...headers,
        },
      };
    }
  });

  function makeClient() {
    const httpLink = new HttpLink({
      uri: "/graphqlServer",
    });
    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache({
        typePolicies: {
          Business: {
            fields: {
              isStarred: {
                read(_, { readField }) {
                  return starredVar().includes(
                    readField("businessId") as never
                  );
                },
              },
            },
          },
        },
      }),
    });
  }

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};

/*
function makeClient() {
  const httpLink = new HttpLink({
    uri: "http://localhost:3000/graphqlServer",
    fetchOptions: { cache: "no-store" },
  });

  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Business: {
          fields: {
            isStarred: {
              read(_, { readField }) {
                return starredVar().includes(readField("businessId") as never);
              },
            },
          },
        },
      },
    }),
    link: httpLink,
  });
}
*/

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      //domain="dev-spxf3pmvngdhjouv.us.auth0.com"
      //clientId="YlqUnmoHJ1EpT8zgrt7aKPVYJ2fbRZGp"
      //authorizationParams={{ redirect_uri: window.location.origin }}
      authorizationParams={{
        redirect_uri: "https://first-vercel-attempt.vercel.app",
        //redirect_uri: window.location.origin ,
        audience: "https://mareci.com",
      }}
    >
      <AppWithApollo>{children}</AppWithApollo>
    </Auth0Provider>
  );
}
/*
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      //domain="dev-spxf3pmvngdhjouv.us.auth0.com"
      //clientId="YlqUnmoHJ1EpT8zgrt7aKPVYJ2fbRZGp"
      //authorizationParams={{ redirect_uri: window.location.origin }}
      authorizationParams={{ redirect_uri: "http://localhost:3000" }}
    >
      <ApolloNextAppProvider makeClient={makeClient}>
        {children}
      </ApolloNextAppProvider>
    </Auth0Provider>
  );
}
  */
