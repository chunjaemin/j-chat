import {configureStore, createSlice} from '@reduxjs/toolkit'

let apple = createSlice({
    name : 'apple',
    initialState: 10,
    reducers : {
        changeApple(state, action) {
            console.log(action)
            return state + 10
        }
    }
})

let banana = createSlice({
    name : 'banana',
    initialState: [10,20,30],
    reducers : {
        changeBanana(state) {
            state[0] = state[0] + 10
        }
    }
})

export let {changeApple} = apple.actions
export let {changeBanana} = banana.actions

export default configureStore({
    reducer : {
        작명 : apple.reducer,
        banana : banana.reducer
    }
}) 