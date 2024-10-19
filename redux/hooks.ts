"use client"

import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()