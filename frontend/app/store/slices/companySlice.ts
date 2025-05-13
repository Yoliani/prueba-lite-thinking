import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Company,
  CompanyCreate,
  CompanyUpdate,
} from "../../integrations/company/types";
import { appClient } from "~/integrations";

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  status: "idle",
  error: null,
};

// Async thunks
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      return await appClient.companyService.getCompanies();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  "companies/createCompany",
  async (company: CompanyCreate, { rejectWithValue }) => {
    try {
      return await appClient.companyService.createCompany(company);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (
    { nit, data }: { nit: string; data: CompanyUpdate },
    { rejectWithValue }
  ) => {
    try {
      return await appClient.companyService.updateCompany(nit, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (nit: string, { rejectWithValue }) => {
    try {
      await appClient.companyService.deleteCompany(nit);
      return nit;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setSelectedCompany: (state, action: PayloadAction<Company | null>) => {
      state.selectedCompany = action.payload;
    },
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch companies
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create company
      .addCase(createCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Update company
      .addCase(updateCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.companies.findIndex(
          (company) => company.nit === action.payload.nit
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Delete company
      .addCase(deleteCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = state.companies.filter(
          (company) => company.nit !== action.payload
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCompany, clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
