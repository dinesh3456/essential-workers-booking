import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the UI state interface
interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  notifications: {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    timestamp: number;
  }[];
  loading: {
    global: boolean;
    components: Record<string, boolean>;
  };
  modals: {
    [key: string]: boolean;
  };
}

const initialState: UIState = {
  sidebarOpen: false,
  theme: "light",
  notifications: [],
  loading: {
    global: false,
    components: {},
  },
  modals: {},
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<{
        type: "success" | "error" | "warning" | "info";
        message: string;
      }>
    ) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setComponentLoading: (
      state,
      action: PayloadAction<{
        component: string;
        loading: boolean;
      }>
    ) => {
      state.loading.components[action.payload.component] =
        action.payload.loading;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      state.modals = {};
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setComponentLoading,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
