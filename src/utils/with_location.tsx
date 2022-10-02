import React from "react";
import { Location, WindowLocation, NavigateFn } from "@reach/router";
import queryString from "query-string";

export interface PropsWithLocation {
    location: WindowLocation<unknown>;
    navigate: NavigateFn;
    search: queryString.ParsedQuery<string>;
}
// add location related info to props
export const with_location = (ComponentToWrap: React.FC<any>) => (props: any) =>
    <Location>
        {({ location, navigate }) => (
            <ComponentToWrap
                {...props}
                location={location}
                navigate={navigate}
                search={location.search ? queryString.parse(location.search) : {}}
            />
        )}
    </Location>;

