import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Product,
  ProductCreate,
  ProductUpdate,
} from "../../integrations/product/types";
import { appClient } from "~/integrations";

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filter: {
    companyNit: string | null;
  };
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  status: "idle",
  error: null,
  filter: {
    companyNit: null,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { products: ProductState };
      const { companyNit } = state.products.filter;

      if (companyNit) {
        return await appClient.productService.getProductsByCompany(companyNit);
      } else {
        return await appClient.productService.getProducts();
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: ProductCreate, { rejectWithValue }) => {
    try {
      return await appClient.productService.createProduct(product);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { id, data }: { id: number; data: ProductUpdate },
    { rejectWithValue }
  ) => {
    try {
      return await appClient.productService.updateProduct(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      await appClient.productService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setCompanyFilter: (state, action: PayloadAction<string | null>) => {
      state.filter.companyNit = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedProduct, setCompanyFilter, clearProductError } =
  productSlice.actions;
export default productSlice.reducer;
