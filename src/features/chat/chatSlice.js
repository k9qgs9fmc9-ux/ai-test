import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import OpenAI from 'openai';
import { MODES, getModeConfig } from '../../data/modes';

// Async thunk to send message to backend or directly to API
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ messages, apiKey }, { rejectWithValue }) => {
    try {
      // If API Key is provided, use client-side call
      if (apiKey) {
        const openai = new OpenAI({
          apiKey: apiKey,
          baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
          dangerouslyAllowBrowser: true // Enable browser usage
        });

        const completion = await openai.chat.completions.create({
          model: 'qwen-max',
          messages: messages,
        });

        return completion.choices[0].message;
      } else {
        // Fallback to backend server
        // Use relative path to work with both dev and production (if served from same origin)
        // Or default to localhost for dev
        const apiBase = import.meta.env.PROD ? '/api/chat' : 'http://localhost:3001/api/chat';
        try {
          const response = await axios.post(apiBase, { messages });
          return response.data.choices[0].message;
        } catch (axiosError) {
          // If 404, it means backend is missing (common in static hosting like GitHub Pages)
          if (axiosError.response && axiosError.response.status === 404) {
            throw new Error("检测到无后端服务。请点击右上角设置图标，填入您的 API Key 以使用纯前端模式。");
          }
          throw axiosError;
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const initialMode = MODES.EMOTIONAL;
const initialConfig = getModeConfig(initialMode);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    mode: initialMode,
    messages: [
      { role: 'system', content: initialConfig.systemPrompt }
    ],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload });
    },
    clearHistory: (state) => {
      const config = getModeConfig(state.mode);
      state.messages = [
        { role: 'system', content: config.systemPrompt }
      ];
    },
    switchMode: (state, action) => {
      const newMode = action.payload;
      const config = getModeConfig(newMode);
      state.mode = newMode;
      // Reset messages with new system prompt
      state.messages = [
        { role: 'system', content: config.systemPrompt }
      ];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addUserMessage, clearHistory, switchMode } = chatSlice.actions;

export default chatSlice.reducer;
