import { DocumentNode, print } from 'graphql';

const API_GATEWAY_ENDPOINT = `/graphql`;

export class GraphQlApiClient {
    public fetch = async (query: DocumentNode, variables?: object) => {
        const printedQuery = print(query);
        return await fetch(`${window.location.origin}${API_GATEWAY_ENDPOINT}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: printedQuery,
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
    }
}