```jsx inside Markdown
// Video and Audio Player vars.
const playerRef = React.useRef(null);
const [playerState, setplayerState] = React.useState({
    url: "https://dev.api.convin.ai/meeting/meeting/media/1352/?auth=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluQGNvbnZpbi5haSIsImV4cCI6MTYwMDQyMzE4OCwiZW1haWwiOiJhZG1pbkBjb252aW4uYWkifQ.ck1R_HJngJWOtK2AV-np9vlBgtfwX17kf1COKc3qY6Y",
    playing: false,
    playbackRate: 1,
    played: 0,
    duration: 0,
    controls: false,
    muted: false,
    volume: 1,
    loop: false,
});
const [playerUX, setplayerUX] = React.useState({
    isBuffering: false,
    showClipper: false,
    duration: 0,
    stopAt: 0,
});
const [playedSeconds, setplayedSeconds] = React.useState(0);
const [showSpeedContext, setshowSpeedContext] = React.useState(false);
const [seeking, setseeking] = React.useState(false);
const playerHandlers = {
    togglePlay: () => setplayerState({ ...playerState, playing: !playerState.playing }),
    seekToPoint: (time, seeknplay) => {
        if (playerRef.current) {
            time = Math.floor(time);
            playerRef.current.seekTo(time);
            setplayedSeconds(time);
            if (seeknplay) {
                setplayerState({ ...playerState, playing: true });
            }
        }
    },
    getPlayedDuration: (duration) => {
        if (!seeking) {
            setplayerState({
                ...playerState,
                played: duration.played,
            });
            setplayedSeconds(duration.playedSeconds);
        }
    },
    setplaybackRate: (playbackRate = 1) => {
        setplayerState({ ...playerState, playbackRate });
        setshowSpeedContext(false);
    },
    handleBuffer: (status) => {
        setplayerUX({
            ...playerUX,
            isBuffering: status,
        });
    },
    toggleMute: () => setplayerState({ ...playerState, muted: !playerState.muted }),
    toggleSpeedContext: () => setshowSpeedContext(!showSpeedContext),
    toggleLoop: () => setplayerState({ ...playerState, loop: !playerState.loop }),
    handleEnd: () => setplayerState({ ...playerState, playing: playerState.loop }),
    toggleSeek: () => setseeking(!seeking),
    handlePlayerDuration: (value) => {
        setplayerUX({
            ...playerUX,
            duration: value,
            stopAt: value,
        });
    },
    handleStopAt: (value) => {
        setplayerUX({
            ...playerUX,
            stopAt: value,
        });
    },
};
<VideoPlayer
    {...playerHandlers}
    playerState={playerState}
    playerUX={playerUX}
    showSpeedContext={showSpeedContext}
    playedSeconds={playedSeconds}
    seeking={seeking}
    playerRef={playerRef}
    setplayedSeconds={setplayedSeconds}
/>;
```
