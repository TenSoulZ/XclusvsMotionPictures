import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoThumbnail = ({ video, className, style }) => {
    const [thumb, setThumb] = useState('https://placehold.co/800x450?text=Video');

    useEffect(() => {
        const fetchThumbnail = async () => {
             // 1. If backend has thumbnail, use it
            if (video.thumbnail) {
                setThumb(video.thumbnail);
                return;
            }

            const url = video.video_url;
            if (!url) return;

            // 2. YouTube (Sync)
            let videoId = '';
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                 videoId = url.split('embed/')[1].split('?')[0];
            }

            if (videoId) {
                setThumb(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
                return;
            }

            // 3. Vimeo (Async)
            if (url.includes('vimeo.com/')) {
                try {
                    // Use Vimeo oEmbed API (No key required for public videos)
                    // We need the full original URL (not the player.vimeo one necessarily, but oembed handles most)
                    const cleanUrl = url.includes('player.vimeo.com') 
                        ? `https://vimeo.com/${url.split('/').pop()}` 
                        : url;
                        
                    const res = await axios.get(`https://vimeo.com/api/oembed.json?url=${cleanUrl}`);
                    if (res.data && res.data.thumbnail_url) {
                        setThumb(res.data.thumbnail_url);
                    }
                } catch (err) {
                    console.error("Error fetching Vimeo thumbnail:", err);
                }
            }
        };

        fetchThumbnail();
    }, [video]);

    return (
        <img 
            src={thumb} 
            alt={video.title} 
            className={className} 
            style={style} 
            loading="lazy"
        />
    );
};

export default VideoThumbnail;
