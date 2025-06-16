

const API_GATEWAY_ENDPOINT = "https://k4iq4bzva9.execute-api.eu-west-2.amazonaws.com/graphql";

export class GraphQlApiClient {

    fetch(query: any, variables: any) {
        const response = fetch(API_GATEWAY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
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
        .catch((error) => console.log(JSON.stringify(error, null, 2)));

        return response;
    }
}