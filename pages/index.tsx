import { useEffect, useRef, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";

import Head from "next/head";
import {
  Button,
  Container,
  Grid,
  Input,
  Spacer,
  User,
  Row,
  Loading,
} from "@nextui-org/react";
import { gql } from "@apollo/client";
import getUsersQuery from "../graphql/queries/getUsers";
import searchUsersQuery from "../graphql/queries/searchUsers";

const GET_USERS = gql(getUsersQuery);
const SEARCH_USERS = gql(searchUsersQuery);

export default function Home() {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const usersRef = useRef(null);

  const { data, loading, error } = useQuery(GET_USERS);

  const [getSearchedUsers] = useLazyQuery(SEARCH_USERS, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      setUsers(data.searchUser);
    },
  });

  useEffect(() => {
    if (data) {
      setUsers(data.users);
      usersRef.current = data.users;
    }
  }, [data]);

  const searchUser = (value) => {
    getSearchedUsers({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (searchValue) {
      searchUser(searchValue);
    } else if (usersRef.current) {
      setUsers(usersRef.current);
    }
  }, [searchValue]);
  // useEffect(() => {
  //   if (searchValue) {
  //     searchUser(searchValue);
  //   } else {
  //     setUsers(usersRef.current);
  //   }
  // }, [searchValue]);

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <>
      <Head>
        <title>ZeroSearch</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ backgroundColor: "pink", height: "100vh" }}>
        <Container
          css={{
            display: "flex",
            justifyContent: "center",
            backgounrdColor: "pink",

            alignItems: "center",
            //
          }}
        >
          <Spacer y={2.5} />
          <Row justify="center" align="center">
            <Input
              clearable
              labelPlaceholder="User"
              onClearClick={() => {
                setSearchValue("");
                setUsers(usersRef.current);
              }}
              initialValue={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {/* <Button color="error" auto onClick={() => searchUser(searchUser)}>
              Search user
            </Button> */}
          </Row>

          <Spacer y={2.5} />
          <Row justify="center" align="center">
            {loading ? (
              <Loading />
            ) : (
              <Grid.Container gap={2} justify="center">
                {users.map((u) => (
                  <Grid xs={3} key={u.id}>
                    <User
                      src={u.image}
                      name={`${u.firstName}${u.lastName}`}
                      description={u.email}
                      size="lg"
                      bordered
                      color="error"
                    />
                  </Grid>
                ))}
              </Grid.Container>
            )}
          </Row>
        </Container>
      </main>
    </>
  );
}
