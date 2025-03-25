import { configureStore } from '@reduxjs/toolkit';
import app from '@/slices/app.slice';
import dart from '@/slices/dart.slice';
import config from '@/utils/config';
import { Env } from '@/types/env';
import logger from 'redux-logger';

const store = configureStore({
  reducer: {
    app,
    dart,
  },
  middleware: getDefaultMiddleware =>
    config.env === Env.dev ? getDefaultMiddleware() : getDefaultMiddleware().concat(logger),
  devTools: config.env === Env.dev,
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export default store;
