import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "@/components/Header";
import MiniPlayer from "@/components/player/MiniPlayer";
import GlobalFooter from "@/components/GlobalFooter";
import { usePlaylistAudio } from "@/hooks/usePlaylistAudio";

export default function Layout() {
    usePlaylistAudio();

    return (
        // position + zIndex 1 ensures this content layer paints above
        // the fixed BackgroundStage (zIndex 0)
        <Box sx={{ position: "relative", zIndex: 1 }}>
            <Header />
            <Outlet />
            <GlobalFooter />
            <MiniPlayer />
        </Box>
    );
}
