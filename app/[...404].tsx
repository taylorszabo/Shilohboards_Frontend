// app/[...404].tsx

import ErrorScreen from "../reusableComponents/ErrorScreen";

export default function NotFound() {
    return <ErrorScreen errorMessage="The page you are looking for cannot be found." />;
}
