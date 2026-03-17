import { useState } from 'react'
import { BackendStatus } from './components/BackendStatus'  // ← ADD THIS
import './App.css'

function App() {
  // Your existing state and logic
  const [file, setFile] = useState(null)
  // ... etc

  return (
    <div className="app">
      {/* Header */}
      <header>
        <h1>Brain Tumor Classifier</h1>
      </header>

      {/* Backend Status - ADD THIS */}
      <BackendStatus />

      {/* Your existing content */}
      <main>
        {/* Upload section, results, etc */}
      </main>

      {/* Footer */}
      <footer>
        <p>Research purposes only</p>
      </footer>
    </div>
  )
}

export default App