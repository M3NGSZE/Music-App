export interface MusicTrack {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    source: string;
    fileName: string;
    dateAdded: number;
    coverUrl?: string;
    isFavorite: boolean;
}