<template>
    <div class="press-scene" :class="{ 'active': isOpen }" @click="handleClick">
        <p>Press Any Button</p>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import audio from "../game/audio"
import {useSystemStore} from "../store/system";

const store = useSystemStore();
let isOpen = ref(false);

window.addEventListener("keydown", handleClick)

function handleClick() {
    if (isOpen.value) return;
    isOpen.value = true;
    audio.sePressAudio.playAudio();
    setTimeout(() => {
        store.changeScene("play")
    }, 1000)
    window.removeEventListener("keydown", handleClick)
}

</script>

<style lang="scss" scoped>
.press-scene {
    width: 100%;
    height: 100vh;
    background-image: repeating-radial-gradient(circle at center center, transparent 0px, transparent 8px,
    rgba(255, 255, 255, 0.05) 8px, rgba(255, 255, 255, 0.05) 11px, transparent 11px, transparent 17px,
    rgba(255, 255, 255, 0.05) 17px, rgba(255, 255, 255, 0.05) 25px, transparent 25px, transparent 38px,
    rgba(255, 255, 255, 0.05) 38px, rgba(255, 255, 255, 0.05) 42px),
    repeating-radial-gradient(circle at center center, rgb(170, 0, 0) 0px, rgb(170, 0, 0) 11px, rgb(170, 0, 0) 11px, rgb(170, 0, 0) 19px, rgb(170, 0, 0) 19px, rgb(170, 0, 0) 24px, rgb(170, 0, 0) 24px, rgb(170, 0, 0) 33px, rgb(170, 0, 0) 33px, rgb(170, 0, 0) 44px, rgb(170, 0, 0) 44px, rgb(170, 0, 0) 46px);
  background-size: 60px 60px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
        animation: fadeOut .8s .6s ease-out forwards;

        p {
            animation: flash .25s infinite ease-in-out;
        }
    }

    p {
        color: rgb(253,190,0);
        font-size: 28px;
        text-align: center;
        width: 100%;
        animation: flash 2s infinite ease-in-out;
    }
}
</style>