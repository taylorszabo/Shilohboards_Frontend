import {useLocalSearchParams} from "expo-router";
import ErrorScreen from "../reusableComponents/ErrorScreen";

export default function ErrorPage() {
    const { message } = useLocalSearchParams();

    return <ErrorScreen errorMessage={decodeURIComponent(message as string)} />;
}