import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  InventoryItem,
  InventoryItemCreate,
  InventoryItemUpdate,
} from "../../integrations/inventory/types";
import { appClient } from "~/integrations";

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filter: {
    productId: string | null;
  };
  pdfGenerationStatus: "idle" | "loading" | "succeeded" | "failed";
  pdfUrl: string | null;
}

const initialState: InventoryState = {
  items: [],
  selectedItem: null,
  status: "idle",
  error: null,
  filter: {
    productId: null,
  },
  pdfGenerationStatus: "idle",
  pdfUrl: null,
};

// Async thunks
export const fetchInventoryItems = createAsyncThunk(
  "inventory/fetchItems",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { inventory: InventoryState };
      const { productId } = state.inventory.filter;

      if (productId) {
        return await appClient.inventoryService.getInventoryItemsByProduct(
          Number(productId)
        );
      } else {
        return await appClient.inventoryService.getInventoryItems();
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInventoryItem = createAsyncThunk(
  "inventory/createItem",
  async (item: InventoryItemCreate, { rejectWithValue }) => {
    try {
      return await appClient.inventoryService.createInventoryItem(item);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  "inventory/updateItem",
  async (
    { id, data }: { id: number; data: InventoryItemUpdate },
    { rejectWithValue }
  ) => {
    try {
      return await appClient.inventoryService.updateInventoryItem(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  "inventory/deleteItem",
  async (id: number, { rejectWithValue }) => {
    try {
      await appClient.inventoryService.deleteInventoryItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateInventoryReport = createAsyncThunk(
  "inventory/generateReport",
  async ({ companyNit }: { companyNit?: string } = {}, { rejectWithValue }) => {
    try {
      const blob = await appClient.inventoryService.downloadInventoryReport(
        companyNit
      );
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const emailInventoryReport = createAsyncThunk(
  "inventory/emailReport",
  async (email: string, { rejectWithValue }) => {
    try {
      await appClient.inventoryService.emailInventoryReport(email);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<InventoryItem | null>) => {
      state.selectedItem = action.payload;
    },
    setProductFilter: (state, action: PayloadAction<string | null>) => {
      state.filter.productId = action.payload;
    },
    clearInventoryError: (state) => {
      state.error = null;
    },
    resetPdfState: (state) => {
      state.pdfGenerationStatus = "idle";
      state.pdfUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory items
      .addCase(fetchInventoryItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchInventoryItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create inventory item
      .addCase(createInventoryItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Update inventory item
      .addCase(updateInventoryItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Delete inventory item
      .addCase(deleteInventoryItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Generate inventory report
      .addCase(generateInventoryReport.pending, (state) => {
        state.pdfGenerationStatus = "loading";
      })
      .addCase(generateInventoryReport.fulfilled, (state, action) => {
        state.pdfGenerationStatus = "succeeded";
        state.pdfUrl = action.payload;
      })
      .addCase(generateInventoryReport.rejected, (state, action) => {
        state.pdfGenerationStatus = "failed";
        state.error = action.payload as string;
      })
      // Email inventory report
      .addCase(emailInventoryReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(emailInventoryReport.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(emailInventoryReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedItem,
  setProductFilter,
  clearInventoryError,
  resetPdfState,
} = inventorySlice.actions;

export default inventorySlice.reducer;
