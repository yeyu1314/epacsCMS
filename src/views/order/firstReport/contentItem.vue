<template>
    <div class='b'></div>
</template>

<script>

    export default {
        name: "contentItem",
        mounted() {
            this.Bus.$on('listenToA', res => {
                console.log(res)
            });
        },
    }
</script>

<style scoped>

</style>