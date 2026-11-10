export interface MusicTrack {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    source: string;
    coverUrl?: string;
    isFavorite: boolean;
}
