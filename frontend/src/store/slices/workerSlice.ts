import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the worker state interface
interface WorkerState {
  workers: any[];
  currentWorker: any | null;
  loading: boolean;
  error: string | null;
  searchFilters: {
    location?: string;
    service?: string;
    availability?: string;
  };
}

const initialState: WorkerState = {
  workers: [],
  currentWorker: null,
  loading: false,
  error: null,
  searchFilters: {},
};

// Async thunks (placeholder implementations)
export const fetchWorkers = createAsyncThunk(
  "worker/fetchWorkers",
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workers"
      );
    }
  }
);

export const fetchWorkerById = createAsyncThunk(
  "worker/fetchWorkerById",
  async (workerId: string, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      return { id: workerId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch worker"
      );
    }
  }
);

const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    clearWorkerError: (state) => {
      state.error = null;
    },
    setSearchFilters: (state, action: PayloadAction<any>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.searchFilters = {};
    },
    setCurrentWorker: (state, action: PayloadAction<any>) => {
      state.currentWorker = action.payload;
    },
    clearCurrentWorker: (state) => {
      state.currentWorker = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workers cases
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch worker by ID cases
      .addCase(fetchWorkerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorker = action.payload;
      })
      .addCase(fetchWorkerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearWorkerError,
  setSearchFilters,
  clearSearchFilters,
  setCurrentWorker,
  clearCurrentWorker,
} = workerSlice.actions;
export default workerSlice.reducer;
