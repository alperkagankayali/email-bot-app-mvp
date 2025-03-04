"use client";
import {
  getArticle,
  getEducationContent,
  getEducationDetail,
  getEducationListContent,
  getQuiz,
  getVideo,
} from "@/services/service/educationService";
import { IArticleType } from "@/types/articleType";
import { ICourse, IContent, IEducationCreate } from "@/types/courseType";
import { IEducationList } from "@/types/educationListType";
import { IQuizType } from "@/types/quizType";
import { IVideoType } from "@/types/videoType";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface FormValues {
  [field: string]: string | number | boolean | null | string[] | []; // Alanlar dinamik olabilir
}

interface IEducationSlice {
  quiz: IQuizType[];
  quizStatus: "loading" | "succeeded" | "failed" | "idle";
  articleStatus: "loading" | "succeeded" | "failed" | "idle";
  videoStatus: "loading" | "succeeded" | "failed" | "idle";
  educationStatus: "loading" | "succeeded" | "failed" | "idle";
  educationListStatus: "loading" | "succeeded" | "failed" | "idle";
  videos: IVideoType[];
  article: IArticleType[];
  educationContent: ICourse[];
  educationListContent: IEducationList[];
  quizTotalItems: number;
  articleTotalItems: number;
  videoTotalItems: number;
  educationContentTotalItems: number;
  educationDetail: ICourse | null;
  educationListTotalItems: number;
  forms: {
    [language: string]: FormValues; // Her dil için form değerleri
  };
}

const initialState: IEducationSlice = {
  quiz: [],
  educationListContent: [],
  educationListStatus: "idle",
  quizStatus: "idle",
  articleStatus: "idle",
  videoStatus: "idle",
  educationStatus: "idle",
  videos: [],
  article: [],
  educationContent: [],
  forms: {},
  quizTotalItems: 0,
  articleTotalItems: 0,
  videoTotalItems: 0,
  educationContentTotalItems: 0,
  educationListTotalItems: 0,
  educationDetail: null,
};

const educationSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    handleAddEducationFormReset: (state) => {
      state.forms = {};
    },
    handleAddEducationForm: (
      state,
      action: PayloadAction<{ language: string; values: FormValues }>
    ) => {
      const { language, values } = action.payload;
      state.forms[language] = { ...state.forms[language], ...values };
    },
    handleAddEducationListValue: (
      state,
      action: PayloadAction<{ field: string; value: any }>
    ) => {
      const { field, value } = action.payload;
      state.forms[field] = value;
    },
    handleAddEducationFormValue: (
      state,
      action: PayloadAction<{ language: string; field: string; value: any }>
    ) => {
      const { language, field, value } = action.payload;
      if (!state.forms[language]) {
        state.forms[language] = {}; // Eğer dil yoksa başlat
      }
      state.forms[language][field] = value;
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
      .addCase(fetchEducationList.pending, (state) => {
        state.educationListStatus = "loading";
      })
      .addCase(fetchEducationList.fulfilled, (state, action) => {
        state.educationListStatus = "succeeded";
        state.educationListTotalItems = action.payload?.totalItems ?? 0;
        state.educationListContent = action.payload.data;
      })
      .addCase(fetchEducationList.rejected, (state) => {
        state.educationListStatus = "failed";
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

export const fetchEducationList = createAsyncThunk(
  "/education-list",
  async (values: any) => {
    const response = await getEducationListContent(10, 1, values);
    return response;
  }
);

export const fetchVideo = createAsyncThunk(
  "/education-content/video",
  async (filter:any) => {
    const response = await getVideo(filter);
    return response;
  }
);
export const fetchArticle = createAsyncThunk(
  "/education-content/article",
  async (filter:any) => {
    const response = await getArticle(filter);
    return response;
  }
);
export const fetchQuiz = createAsyncThunk(
  "/education-content/quiz",
  async (filter: any) => {
    const response = await getQuiz(filter);
    return response;
  }
);

export const {
  handleAddEducationForm,
  handleArticleDataChange,
  handleVideoDataChange,
  handleQuizDataChange,
  handleEducationContentDataChange,
  handleAddEducationFormValue,
  handleAddEducationListValue,
  handleAddEducationFormReset,
} = educationSlice.actions;

export default educationSlice.reducer;
