import React from "react";
import Box from "@cloudscape-design/components/box";

export const SearchDisplay = ({searchQueryValue}: {searchQueryValue: string}) => {
    return (
        <Box className="search_display">
            {
                searchQueryValue?.length > 0
                    ? <><b>Results for: </b><i className="search_text">{searchQueryValue}</i></>
                    : undefined
            }
        </Box>
    );
}