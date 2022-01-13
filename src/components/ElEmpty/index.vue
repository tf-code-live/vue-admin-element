<template>
    <div class="cpm-empty">
        {{ description }}
    </div>
</template>

<script>
export default {
    props: {
        description: {
            type: String
        }
    }
}
</script>
<style lang='scss' scoped>
.cpm-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #5e6d82;
}
</style>
