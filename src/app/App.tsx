import { RouterProvider } from 'react-router'
import './App.css'
import router from './routes'
import { AudioPlayerProvider } from '../context/AudioPlayerProvider';

function App() {
  return (
    <AudioPlayerProvider>
      <RouterProvider router={router} />
    </AudioPlayerProvider>
  );
}

export default App
