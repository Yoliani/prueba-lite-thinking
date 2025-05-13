import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  currentPage: string;
  dialogs: {
    companyForm: boolean;
    productForm: boolean;
    inventoryForm: boolean;
    confirmDelete: boolean;
    pdfReport: boolean;
  };
  notifications: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: 'light',
  currentPage: 'dashboard',
  dialogs: {
    companyForm: false,
    productForm: false,
    inventoryForm: false,
    confirmDelete: false,
    pdfReport: false,
  },
  notifications: {
    show: false,
    message: '',
    type: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    openDialog: (
      state,
      action: PayloadAction<keyof UiState['dialogs']>
    ) => {
      state.dialogs[action.payload] = true;
    },
    closeDialog: (
      state,
      action: PayloadAction<keyof UiState['dialogs']>
    ) => {
      state.dialogs[action.payload] = false;
    },
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.notifications = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideNotification: (state) => {
      state.notifications.show = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setCurrentPage,
  openDialog,
  closeDialog,
  showNotification,
  hideNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
