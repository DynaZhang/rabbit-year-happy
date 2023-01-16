import {defineStore} from 'pinia';

const defaultState = {
    scene: 'press'
};

export const useSystemStore = defineStore('system', {
    state: () => {
        return {
            ...defaultState
        }
    },
    actions: {
        changeScene(sceneName: string) {
            this.scene = sceneName;
        }
    }
})