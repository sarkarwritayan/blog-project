import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {persistReducer,persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import dataSlice from './features/data';

const persistConfig = {
  key: 'root',
  storage,
  whitelist:['data'],
};

const rootReducer = combineReducers({
  data : dataSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware : [thunk]
});

export const persistor = persistStore(store);