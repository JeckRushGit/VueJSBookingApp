export default {
    install : (app,options) => {
        app.config.globalProperties.$handle_session_expired = function (){
            localStorage.clear();
            this.$store.commit('clear');
            this.$router.push('/login');
        }
    }
}