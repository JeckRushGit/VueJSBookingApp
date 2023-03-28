import {createStore} from "vuex";

const store = createStore({
    state : {
        userdata : null
    },
    getters : {
        userdata(state){
            return state.userdata
        }
    },
    mutations : {
        setInit(state,obj){
            state.userdata = obj
        },
        clear(state){
            state.userdata = null
        }
    }
})

export default store