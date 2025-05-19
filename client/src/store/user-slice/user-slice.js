import axios from 'axios';
import { toast } from 'react-toastify';

export default function createUserSlice(set, get) {
  return {
    current: {},
    loginUser: async (username, password) => {
      try {
        const response = await axios.get(`login`, {username, password});
        set(({ userSlice }) => { userSlice.current = response.data; }, false, 'user/login');
      } catch (error) {
        get().errorSlice.newError(error.message);
        toast.error('An error occured while logging in. Please try again.', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }
    },

    signUpUser: async (username, password) => {
      try {
        const response = await axios.post('signup', {username, password});
        set(({ userSlice }) => { userSlice.current = response.data; }, false, 'user/signUp');
      } catch (error) {
        get().errorSlice.newError(error.message);
        toast.error('An error occured while signing up. Please try again.', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }
    },
    
}

}