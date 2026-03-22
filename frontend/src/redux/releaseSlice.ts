import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RELEASES_API_URL } from "../config/api";
import type {
  Release,
  ReleaseState,
  CreateReleasePayload,
  UpdateReleasePayload,
} from "../types/release.types";

const initialState: ReleaseState = {
  releases: [],
  currentRelease: null,
  loading: false,
  error: null,
};

export const fetchReleases = createAsyncThunk(
  "releases/fetchAll",
  async () => {
    const res = await axios.get<Release[]>(RELEASES_API_URL);
    return res.data;
  },
);

export const createRelease = createAsyncThunk(
  "releases/create",
  async (data: CreateReleasePayload) => {
    const res = await axios.post<Release>(RELEASES_API_URL, data);
    return res.data;
  },
);

export const updateRelease = createAsyncThunk(
  "releases/update",
  async ({ id, name, release_date, steps, additional_info }: UpdateReleasePayload) => {
    const res = await axios.patch<Release>(`${RELEASES_API_URL}/${id}`, {
      name,
      release_date,
      steps,
      additional_info,
    });
    return res.data;
  },
);

export const deleteRelease = createAsyncThunk(
  "releases/delete",
  async (id: string) => {
    await axios.delete(`${RELEASES_API_URL}/${id}`);
    return id;
  },
);

const releaseSlice = createSlice({
  name: "releases",
  initialState,
  reducers: {
    setCurrentRelease(state, action) {
      state.currentRelease = action.payload;
    },
    clearCurrentRelease(state) {
      state.currentRelease = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchReleases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReleases.fulfilled, (state, action) => {
        state.loading = false;
        state.releases = action.payload;
      })
      .addCase(fetchReleases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch releases";
      })
      // create
      .addCase(createRelease.fulfilled, (state, action) => {
        state.releases.unshift(action.payload);
      })
      // update
      .addCase(updateRelease.fulfilled, (state, action) => {
        const idx = state.releases.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.releases[idx] = action.payload;
        if (state.currentRelease?.id === action.payload.id) {
          state.currentRelease = action.payload;
        }
      })
      // delete
      .addCase(deleteRelease.fulfilled, (state, action) => {
        state.releases = state.releases.filter((r) => r.id !== action.payload);
        if (state.currentRelease?.id === action.payload) {
          state.currentRelease = null;
        }
      });
  },
});

export const { setCurrentRelease, clearCurrentRelease } = releaseSlice.actions;
export default releaseSlice.reducer;
