"use client";
import {
  getArticle,
  getQuiz,
  getVideo,
} from "@/services/service/educationService";
import { IArticleType } from "@/types/articleType";
import { ICourse, IEducationCreate } from "@/types/courseType";
import { IQuizType } from "@/types/quizType";
import { IVideoType } from "@/types/videoType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface IEducationSlice {
  quiz: IQuizType[];
  quizStatus: "loading" | "succeeded" | "failed" | "idle";
  articleStatus: "loading" | "succeeded" | "failed" | "idle";
  videoStatus: "loading" | "succeeded" | "failed" | "idle";
  educationStatus: "loading" | "succeeded" | "failed" | "idle";
  videos: IVideoType[];
  article: IArticleType[];
  educationContent: ICourse[];
  createEducation: IEducationCreate | null;
}

const initialState: IEducationSlice = {
  quiz: [],
  quizStatus: "idle",
  articleStatus: "idle",
  videoStatus: "idle",
  educationStatus: "idle",
  videos: [],
  article: [],
  educationContent: [],
  createEducation: null,
};

const educationSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    handleEducationDataChange: (state, action) => {
      state.createEducation = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchVideo.pending, (state) => {
        state.videoStatus = "loading";
      })
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.videoStatus = "succeeded";
        state.videoStatus = action.payload;
      })
      .addCase(fetchVideo.rejected, (state) => {
        state.videoStatus = "failed";
      });
    builder
      .addCase(fetchArticle.pending, (state) => {
        state.articleStatus = "loading";
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.articleStatus = "succeeded";
        state.article = action.payload;
      })
      .addCase(fetchArticle.rejected, (state) => {
        state.articleStatus = "failed";
      });
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.quizStatus = "loading";
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.quizStatus = "succeeded";
        state.quiz = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state) => {
        state.quizStatus = "failed";
      });
  },
});

export const fetchVideo = createAsyncThunk(
  "/education-content/video",
  async () => {
    const response = await getVideo();
    return response.data;
  }
);
export const fetchArticle = createAsyncThunk(
  "/education-content/article",
  async () => {
    const response = await getArticle();
    return response.data;
  }
);
export const fetchQuiz = createAsyncThunk(
  "/education-content/quiz",
  async () => {
    const response = await getQuiz();
    return response.data;
  }
);

export const { handleEducationDataChange } = educationSlice.actions;

export default educationSlice.reducer;
