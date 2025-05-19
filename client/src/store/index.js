import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import createUserSlice from './user-slice/user-slice';

const useStore = create(devtools(immer((...args) => ({
  userSlice: createUserSlice(...args),
}))));

export default useStore;
