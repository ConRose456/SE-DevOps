import React, { useEffect, useState } from "react";
import { Grid } from "@cloudscape-design/components";
import { ItemCard } from "./itemCard";

export const ItemCardGrid = ({items}: {items: any[] | undefined}) => {
    const [colspan, setColspan] = useState(getColspan());

    // Function to get colspan based on current window width
    function getColspan() {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 810) {
                return 12;
            } else if (window.innerWidth < 1235) {
                return 6;
            }
        }
        return 4;
    }

    useEffect(() => {
        const handleResize = () => {
            setColspan(getColspan());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const gridDefinition = items?.map(() => ({ colspan }));
    return (
        <div className="items_grid">
            <Grid
                gridDefinition={gridDefinition}
            >
                {items?.map(
                    (item) => (
                        <div key={`item_card_div_${item}`}>
                            <ItemCard item={item}/>
                        </div>
                    )
                ) ?? []}
            </Grid>
        </div>

    )
}