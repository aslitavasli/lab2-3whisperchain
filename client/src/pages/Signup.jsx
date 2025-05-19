import { Link } from 'react-router-dom';
import { useState } from 'react';
import useStore from '../store/index.js';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const signUserUp = useStore(({ userSlice }) => userSlice.signUpUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup:', { username: username, password });
    const res = signUserUp(username, password)
    console.log('res', res)
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-80">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="string"
          placeholder="Username"
          className="w-full p-2 border mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-500 text-white py-2 rounded" type="submit">Sign Up</button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/" className="text-blue-500">Log in</Link>
      </p>
    </div>
  );
}
