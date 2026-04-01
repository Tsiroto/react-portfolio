import nirvanaCAYA from "@/assets/playlist/Nirvana - Come as you are (Retrowave version).mp3";
import nirvanaSLTS from "@/assets/playlist/Nirvana - Smells likek teen spirit (80s Synthpop).mp3";
import nirvanaLithium from "@/assets/playlist/Nirvana - Lithium (80s Synthpop).mp3";
import gnrSweetChild from "@/assets/playlist/Guns N Roses - Sweet Child O Mine (1980s Synthpop).mp3";
import anginePoitrine from "@/assets/playlist/Angine de Poitrine - Sarniezz.mp3";
import jojoMayer from "@/assets/playlist/Jojo Mayer  Nerve - Ghosts of Tomorrow.mp3";

export type Track = {
    id: number;
    title: string;
    artist: string;
    src: string;
};

export const playlist: Track[] = [
    {
        id: 1,
        title: "Sarniezz",
        artist: "Angine de Poitrine",
        src: anginePoitrine,
    },
    {
        id: 2,
        title: "Ghosts of Tomorrow",
        artist: "Jojo Mayer & Nerve",
        src: jojoMayer,
    },
    {
        id: 3,
        title: "Come As You Are (Retrowave Version)",
        artist: "Nirvana",
        src: nirvanaCAYA,
    },
    {
        id: 4,
        title: "Smells Like Teen Spirit (80s Synthpop)",
        artist: "Nirvana",
        src: nirvanaSLTS,
    },
    {
        id: 5,
        title: "Lithium (80s Synthpop)",
        artist: "Nirvana",
        src: nirvanaLithium,
    },
    {
        id: 6,
        title: "Sweet Child O' Mine (1980s Synthpop)",
        artist: "Guns N' Roses",
        src: gnrSweetChild,
    },
];
