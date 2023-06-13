import { ApolloProvider } from "@apollo/client";
import { NextUIProvider } from "@nextui-org/react";

import client from "../graphql/apollo-client";

import { pinktheme } from "../themes/pinktheme";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <NextUIProvider theme={pinktheme}>
        <Component {...pageProps} />
      </NextUIProvider>
    </ApolloProvider>
  );
}
