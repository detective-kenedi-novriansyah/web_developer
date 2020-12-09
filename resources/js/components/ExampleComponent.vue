<template>
    <div id="app">
        <form v-on:submit.prevent="update ? onUpdate() : onSubmit()" class="knd-newbie-form">
            <div class="knd-newbie-field">
                <input type="text" name="username" v-model="username" id="username" placeholder="Username">
            </div>
            <div class="knd-newbie-field">
                <input type="text" name="phone_number" v-model="phone_number" id="phone_number" placeholder="Phone number">
            </div>
            <div class="knd-newbie-field">
                <button class="knd-newbie-form-button" type="submit">
                    <span v-if="update">
                        Update
                    </span>
                    <span v-else>
                        Create
                    </span>
                </button>
            </div>
        </form>
        <form v-on:submit.prevent="onFilter()" class="knd-newbie-form">
            <div class="knd-newbie-field">
                <input type="text" name="username" v-model="filterusername" id="username" placeholder="Username">
            </div>
            <div>
                Or
            </div>
            <div class="knd-newbie-field">
                <input type="text" name="phone_number" v-model="filterphone_number" id="phone_number" placeholder="Phone number">
            </div>
            <div class="knd-newbie-field">
                <button class="knd-newbie-form-button" type="submit">
                    <span>
                        Find
                    </span>
                </button>
            </div>
        </form>
        <div class="knd-newbie-paginate">
            <button v-for="page in paginates" :key="page" v-on:click="onPaginate(page.url)">
                {{page.label}}
            </button>
        </div>
        <div class="knd-newbie-list">
            <div v-for="user in dataFilter.length !== 0 ? dataFilter : getAllUser " :key="user.id" class="knd-newbie-card">
                <div class="knd-newbie-content">
                    <a href="">
                        {{user.username}}
                    </a>
                    <p>
                        {{user.phone_number}}
                    </p>
                </div>
                <div class="knd-newbie-footer">
                    <button class="knd-newbie-button-update" v-on:click="handleClickUpdate(user.id)">
                        Update
                    </button>
                    <button class="knd-newbie-button-delete" v-on:click="onDeleteUser(user.id)">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    data: () => ({
        username: '',
        phone_number: '',
        filterusername: '',
        filterphone_number: '',
        update: false,
        filter: false
    }),
    computed: {
        ...mapGetters(['getAllUser','detail','dataFilter','paginates']),
    },
    methods: {
        onDeleteUser (newvalue)  {
            this.$store.dispatch('deleteUser',newvalue).then((res) => {
                this.$store.commit('DROP_USER', res.data.user)
                this.$store.dispatch('fetchUser')
            }).catch((err) => {
                this.$vs.notification({
                    color: 'danger',
                    position: 'bottom-center',
                    title: err.response.message,
                })
            })
        },
        handleClickUpdate (newValue) {
            this.$store.dispatch('retrieveUser', newValue).then((res) => {
                this.username = this.detail.username
                this.phone_number = this.detail.phone_number
                this.update = true
            })
        },
        onUpdate () {
            const data = {
                id: this.detail.id,
                username: this.username,
                phone_number: this.phone_number
            }
            this.$store.dispatch('updateUser', data).then((res) => {
                this.$store.commit("SET_USER", res.data.user)
                this.username = ''
                this.phone_number = ''
                this.update = false
            })
        },
        onSubmit () {
            const data = {
                username: this.username,
                phone_number: this.phone_number,
            }
            console.log(data)
            this.$store.dispatch('createUser', data).then((res) => {
                this.$store.commit('CREATE_USER', res.data.user)
                this.username = '';
                this.phone_number = '';
            })
        },
        onFilter () {
            const data = {
                username: this.filterusername,
                phone_number: this.filterphone_number,
            }
            this.$store.dispatch('filterUser', data)
        },
        onCancel () {
            this.$store.dispatch('onCancel').then(() => {
                this.$store.dispatch('fetchUser')
            })
        },
        onPaginate (newValue) {
            this.$store.dispatch('getPaginate', newValue)
        }
    },
    mounted() {
        this.$store.dispatch('fetchUser')
    }
}
</script>

<style>
#app {
    padding: 4rem;
}

input {
    width: 100%;
}

.knd-newbie-form {
    display: flex;
    align-items: center;
    margin-bottom: 0.50rem;
}

.knd-newbie-form > .knd-newbie-field {
    width: 100%;
    margin-left: 0.40rem;
    margin-right: 0.40rem;
}

.knd-newbie-form > .knd-newbie-field:last-child {
    width: 200px;
}

.knd-newbie-field > input {
    border: none;
    outline: none;
    padding: 0.50rem;
    box-shadow: 0 -2px 5px -2px rgab(0,0,0,0.75);
    border-radius: 10px;
}

.knd-newbie-field > button {
    width: 100%;
    background-color: greenyellow !important;
    color: black !important;
    border: none;
    outline: none;
    border-radius: 10px;
    padding: 0.50rem;
    box-shadow: 0 -2px 5px -2px rgab(0,0,0,0.75);
    cursor: pointer;
}

.knd-newbie-list {
    height: 100vh;
    display: flex;
    padding: 2rem;
    flex-wrap: wrap;
    overflow: auto;
}
.knd-newbie-card {
    padding: 0.50rem;
    width: 45%;
    height: 100px;
    background-color: white;
    box-shadow: 0 -2px 5px -2px rgab(0,0,0,0.75);
    margin: 0.40rem;
    border-radius: 10px;
    display: flex;
}
.knd-newbie-card > .knd-newbie-content{
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
}

.knd-newbie-card > .knd-newbie-footer {
    display: flex;
    flex-direction: column;
}
.knd-newbie-footer > button {
    margin: 0.20rem;
    border: none;
    outline: none;
    border-radius: 10px;
    background-color: skyblue;
    color: white;
    padding: 0.50rem;
}

button:last-child {
    background-color: red;
    color: white;
}

.knd-newbie-paginate {
    display: flex;
    flex-direction: row;
    justify-content: center;
    overflow: auto;
}

.knd-newbie-paginate > button {
    width: 80px;
    height: 50px;
    border: none;
    outline: none;
}

.knd-newbie-paginate > button:first-child,
.knd-newbie-paginate > button:last-child {
    display: none;
}

</style>