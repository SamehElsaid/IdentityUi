import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: false
}

const LoadingHome = createSlice({
  name: 'LoadingHome',
  initialState,
  reducers: {
    SET_ACTIVE_LOADING: (state, action) => {
      state.data = true
    },
    SET_STOP_LOADING: (state, action) => {
      state.data = false
    }
  }
})

export let { SET_ACTIVE_LOADING, SET_STOP_LOADING } = LoadingHome.actions

export default LoadingHome.reducer
