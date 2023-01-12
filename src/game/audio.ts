export enum AUDIODATA {
    MAIN_BGM = 'assets/audio/bgm.mp3',
    PRESS = 'assets/audio/press.mp3',
    OPEN = 'assets/audio/open.mp3',
    FADE = 'assets/audio/fade.mp3'
};

abstract class AudioClass {
    audio: HTMLMediaElement;
    constructor(src: string) {
        this.audio = new Audio();
        this.audio.src = src;
    }
    playAudio() {}
    stopAudio() {}
}

class BGMAudio extends AudioClass {
    private static instance: BGMAudio;
    private constructor(src: string) {
        super(src);
    }

    public static getInstance(src: string) {
        if (!BGMAudio.instance) {
            BGMAudio.instance = new BGMAudio(src);
        }
        return BGMAudio.instance;
    }

    playAudio(continuate: boolean = true): HTMLMediaElement {
        if (!continuate) {
            this.audio.currentTime = 0;
        }
        this.audio.volume = 0.6;
        this.audio.loop = true;
        this.audio.play();
        return this.audio;
    }

    stopAudio(): void {
        if (!this.audio) {
            return;
        }
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}

class SimpleAudio extends AudioClass {
    private static instance: SimpleAudio;
    private constructor(src: string) {
        super(src);
    }

    public static getInstance(src: string) {
        if (!SimpleAudio.instance) {
            SimpleAudio.instance = new SimpleAudio(src);
        }
        return SimpleAudio.instance;
    }

    playAudio(): HTMLMediaElement {
        this.audio.currentTime = 0;
        this.audio.volume = 1;
        this.audio.play();
        return this.audio;
    }

    stopAudio(): void {}
}

export default {
    bgmAudio: BGMAudio.getInstance(AUDIODATA.MAIN_BGM),
    seOpenAudio: SimpleAudio.getInstance(AUDIODATA.OPEN),
    seFadeAudio: SimpleAudio.getInstance(AUDIODATA.FADE),
    sePressAudio: SimpleAudio.getInstance(AUDIODATA.PRESS)
}