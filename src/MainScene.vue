<template>
    <div ref="gameRef" class="main-game"></div>
</template>

<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from 'vue';
import Game from './game';
import playAudio from './game/audio';

const gameRef = ref<HTMLDivElement | null>(null);
let game;
onMounted(() => {
    playAudio.bgmAudio.playAudio();
    game = new Game(gameRef?.value as HTMLDivElement);
});
onUnmounted(() => {
    game?.destory();
});

</script>