<template>
    <div>
        <el-button type='info' @click="loginout">退出</el-button>
    </div>
</template>

<script>
export default {
    created() {

    },
    props: {

    },
    data() {
        return {

        };
    },
    methods: {
        loginout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    },
    components: {

    },
    computed: {

    },
};
</script>

<style scoped lang="less">



</style>
