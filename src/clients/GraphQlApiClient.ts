import { DocumentNode, print } from 'graphql';

const API_GATEWAY_ENDPOINT = "https://k4iq4bzva9.execute-api.eu-west-2.amazonaws.com/graphql";

export class GraphQlApiClient {

    async fetch(query: DocumentNode, variables: object) {
        const queryString = print(query);

        const response = await fetch(API_GATEWAY_ENDPOINT ?? "http://localhost:4000/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: queryString,
                variables
            })
        })
        .then((res) => res.json())
        .then((result) => {
            if (result.errors) {
                console.log(JSON.stringify(result.errors, null, 2));
            }
            return result ?? {};
        })
        .catch((error) => console.log(error));

        return response;
    }
}