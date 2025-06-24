export const validateBookInputs = (
    {
        id,
        title,
        authors,
        description,
    } : {
        id: string | undefined,
        title: string | undefined,
        authors: string | undefined,
        description: string | undefined,
    }
) => {
    const fields = new Map([
        ["id", id],
        ["title", title],
        ["authors", authors],
        ["description", description]
    ])

    const invalidInputs = fieldsEmpty(fields);
    return invalidInputs.length > 0 ? invalidInputs : [];
}

const fieldsEmpty = (fields: Map<string, string | undefined>): string[] => {
    return Array.from(fields).map((field) => {
        if (!field[1]?.length) {
            return field[0];
        }
    }).filter(field => field) as string[];
}