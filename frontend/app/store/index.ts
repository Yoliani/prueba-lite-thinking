import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Create empty reducers initially that will be replaced when the actual slices are loaded
const emptyReducer = () => ({});

export const store = configureStore({
  reducer: {
    companies: emptyReducer,
    products: emptyReducer,
    inventory: emptyReducer,
    ui: emptyReducer,
  },
});

// Dynamic reducer replacement
export const injectReducer = (key: string, reducer: any) => {
  store.replaceReducer({
    ...store.getState(),
    [key]: reducer,
  } as any);
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
