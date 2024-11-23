"use client";
import {
  getArticle,
  getEducationContent,
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
  quizTotalItems: number;
  articleTotalItems: number;
  videoTotalItems: number;
  educationContentTotalItems: number;
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
  quizTotalItems: 0,
  articleTotalItems: 0,
  videoTotalItems: 0,
  educationContentTotalItems: 0,
};

const educationSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    handleEducationDataChange: (state, action) => {
      state.createEducation = action.payload;
    },
    handleArticleDataChange: (state, action) => {
      state.article = action.payload;
    },
    handleVideoDataChange: (state, action) => {
      state.videos = action.payload;
    },
    handleQuizDataChange: (state, action) => {
      state.quiz = action.payload;
    },
    handleEducationContentDataChange: (state, action) => {
      state.educationContent = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchVideo.pending, (state) => {
        state.videoStatus = "loading";
      })
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.videoStatus = "succeeded";
        state.videoTotalItems = action.payload.totalItems ?? 0;
        state.videos = action.payload.data;
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
        state.articleTotalItems = action.payload.totalItems ?? 0;
        state.article = action.payload.data;
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
        state.quizTotalItems = action.payload.totalItems ?? 0;
        state.quiz = action.payload.data;
      })
      .addCase(fetchQuiz.rejected, (state) => {
        state.quizStatus = "failed";
      });
    builder
      .addCase(fetchContent.pending, (state) => {
        state.educationStatus = "loading";
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.educationStatus = "succeeded";
        state.educationContentTotalItems = action.payload.totalItems ?? 0;
        state.educationContent = action.payload.data;
      })
      .addCase(fetchContent.rejected, (state) => {
        state.educationStatus = "failed";
      });
  },
});

export const fetchContent = createAsyncThunk(
  "/education-content",
  async (limit: number) => {
    const response = await getEducationContent(limit, 1);
    return response;
  }
);

export const fetchVideo = createAsyncThunk(
  "/education-content/video",
  async (limit: number) => {
    const response = await getVideo(limit, 1);
    return response;
  }
);
export const fetchArticle = createAsyncThunk(
  "/education-content/article",
  async (limit: number) => {
    const response = await getArticle(limit, 1);
    return response;
  }
);
export const fetchQuiz = createAsyncThunk(
  "/education-content/quiz",
  async (limit: number) => {
    const response = await getQuiz(limit, 1);
    return response;
  }
);

export const {
  handleEducationDataChange,
  handleArticleDataChange,
  handleVideoDataChange,
  handleQuizDataChange,
  handleEducationContentDataChange,
} = educationSlice.actions;

export default educationSlice.reducer;
