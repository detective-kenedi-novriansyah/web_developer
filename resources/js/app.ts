import Vue from 'vue'
import ExampleComponent from './components/ExampleComponent.vue'
import Vuex from 'vuex'
import axios, { AxiosResponse } from 'axios'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles

interface User {
    id: number;
    username: string;
    phone_number: string;
}

interface Pagination {
    active: boolean;
    label: number;
    url: string
}

interface UserState {
    readonly user: User;
    readonly userAll: User[];
    readonly dataFilter: User[];
    readonly paginate: Pagination[];
}

interface UserMutationsState {
    [x: string]: (user: UserState, data: any) => void
}

interface UserGettersState {
    [x: string]: (user: UserState) => void
}

const state: UserState = {
    user: {
        id: 0,
        username: '',
        phone_number: ''
    },
    userAll: [],
    dataFilter: [],
    paginate: []
}

const actions = {
    async createUser({commit} : any, data: User) {
        const response = await axios.post('http://localhost:8000/api/user', data)
        return response
    },
    async fetchUser({commit} : any) {
        const response = await axios.get('http://localhost:8000/api/user', {
        }).then((res: AxiosResponse) => {
            commit('SET_ALL_USER', res.data.user)
        })
        return response
    },
    async deleteUser({commit}: any, data: number) {
        const response = await axios.delete(`http://localhost:8000/api/user/${data}`)
        return response
    },
    async retrieveUser({commit}: any, data: User){
        return commit('UPDATE_USER', data)
    },
    async updateUser({commit}: any, data: User) {
        const response = await axios.put(`http://localhost:8000/api/user/${data.id}`, data)
        return response
    },
    async filterUser({commit}: any, data: User) {
        return commit('FILTER_USER', data)
    },
    async getPaginate({commit} : any, params: string) {
        const response = await axios.get(params, {
        }).then((res: AxiosResponse) => {
            commit('SET_ALL_USER', res.data.user)
        })
        return response
    },
}

const mutations: UserMutationsState = {
    CREATE_USER: (user: UserState, data: any) => (user.userAll.unshift(data)),
    SET_ALL_USER: (user: UserState | any, data: any) => {
        user.userAll = data.data
        user.paginate = data.links
        return;
    },
    DROP_USER: (user: UserState | any, data: number) => (user.userAll = user.userAll.filter((x: User) => x.id !== data)),
    UPDATE_USER: (user: UserState | any, data: number) => {
        const filters = user.userAll.filter((x: User) => x.id === data )[0]
        return user.user = filters
    },
    SET_USER: (user: UserState | any, data: User) => (user.userAll = user.userAll.map((x: User) => x.id === data.id ? data : x)),
    FILTER_USER: (user: UserState | any, data: User) => {
        const filters= user.userAll.filter((x: User) => x.username.indexOf(data.username) >- 1 && x.phone_number.indexOf(data.phone_number) >- 1)

        return user.dataFilter = filters
    }
}

const getters: UserGettersState = {
    getAllUser: (user: UserState) => user.userAll,
    detail: (user: UserState) => user.user,
    dataFilter: (user: UserState) => user.dataFilter,
    paginates: (user: UserState) => user.paginate
}

const userReducer = {
    state,
    actions,
    mutations,
    getters
}

Vue.use(Vuex)
Vue.use(Vuesax)

const store = new Vuex.Store<UserState>({
    modules: {
        userReducer,
    }
})

Vue.config.productionTip = false

const app = new Vue({
    el: '#app',
    store,
    render: (h) => h(ExampleComponent)
})