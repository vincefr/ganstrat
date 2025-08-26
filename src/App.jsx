import { useState, useEffect } from 'react'

function App() {
  const [numbers, setNumbers] = useState([null, null, null, null, null])
  const [stars, setStars] = useState([null, null])
  const [isRevealing, setIsRevealing] = useState(false)
  const [jackpot, setJackpot] = useState(2400000)
  const [participants, setParticipants] = useState(127458)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [selectedNumbers, setSelectedNumbers] = useState([])
  const [selectedStars, setSelectedStars] = useState([])
  const [showWeb3Modal, setShowWeb3Modal] = useState(false)

  // Timer pour le prochain tirage
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const tonight = new Date()
      tonight.setHours(20, 0, 0, 0)
      
      if (now > tonight) {
        tonight.setDate(tonight.getDate() + 1)
      }
      
      const diff = tonight - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Animation du compteur de participants
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(prev => prev + Math.floor(Math.random() * 10))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Génération des numéros aléatoires
  const generateRandomNumbers = () => {
    const nums = []
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 49) + 1
      if (!nums.includes(n)) nums.push(n)
    }
    return nums.sort((a, b) => a - b)
  }

  const generateRandomStars = () => {
    const s = []
    while (s.length < 2) {
      const n = Math.floor(Math.random() * 12) + 1
      if (!s.includes(n)) s.push(n)
    }
    return s.sort((a, b) => a - b)
  }

  // Révéler tous les numéros
  const revealAll = async () => {
    if (isRevealing) return
    setIsRevealing(true)
    
    const newNumbers = generateRandomNumbers()
    const newStars = generateRandomStars()
    
    // Animation progressive
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setNumbers(prev => {
        const updated = [...prev]
        updated[i] = newNumbers[i]
        return updated
      })
    }
    
    for (let i = 0; i < 2; i++) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setStars(prev => {
        const updated = [...prev]
        updated[i] = newStars[i]
        return updated
      })
    }
    
    setIsRevealing(false)
  }

  // Reset
  const resetGame = () => {
    setNumbers([null, null, null, null, null])
    setStars([null, null])
    setSelectedNumbers([])
    setSelectedStars([])
  }

  // Sélection manuelle des numéros
  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num))
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, num])
    }
  }

  const toggleStar = (star) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter(s => s !== star))
    } else if (selectedStars.length < 2) {
      setSelectedStars([...selectedStars, star])
    }
  }

  const prizeTable = [
    { match: '5 + 2 ⭐', prize: '10,000,000 €', odds: '1:139,838,160' },
    { match: '5 + 1 ⭐', prize: '500,000 €', odds: '1:6,991,908' },
    { match: '5', prize: '100,000 €', odds: '1:3,107,515' },
    { match: '4 + 2 ⭐', prize: '5,000 €', odds: '1:621,503' },
    { match: '4 + 1 ⭐', prize: '500 €', odds: '1:31,076' },
    { match: '3 + 2 ⭐', prize: '100 €', odds: '1:14,126' },
    { match: '4', prize: '50 €', odds: '1:13,812' },
    { match: '2 + 2 ⭐', prize: '20 €', odds: '1:986' },
    { match: '3 + 1 ⭐', prize: '15 €', odds: '1:707' },
    { match: '3', prize: '10 €', odds: '1:314' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-50"></div>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-4xl">🎰</span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            GanStrat
          </h1>
        </div>
        <button
          onClick={() => setShowWeb3Modal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          🚀 Mode Web3
        </button>
      </header>

      {/* Jackpot Display */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-block bg-black/30 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
          <p className="text-sm uppercase tracking-wider text-yellow-400 mb-2">Jackpot actuel</p>
          <p className="text-5xl font-bold text-white">
            {jackpot.toLocaleString()} €
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <div>
              <span className="text-gray-400">Participants: </span>
              <span className="text-yellow-400 font-bold">{participants.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Prochain tirage: </span>
              <span className="text-yellow-400 font-bold">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Widget principal */}
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            🎯 Tirage du Jour
          </h2>
          
          {/* Numéros */}
          <div className="flex justify-center gap-3 mb-6">
            {numbers.map((num, i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500 ${
                  num ? 'bg-gradient-to-br from-blue-500 to-blue-700 scale-110 rotate-360' : 'bg-gray-700/50'
                } shadow-xl`}
              >
                {num || '?'}
              </div>
            ))}
            {stars.map((star, i) => (
              <div
                key={`star-${i}`}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500 ${
                  star ? 'bg-gradient-to-br from-yellow-500 to-orange-600 scale-110' : 'bg-gray-700/50'
                } shadow-xl relative`}
              >
                {star ? '⭐' : '?'}
                {star && <span className="absolute text-white text-sm">{star}</span>}
              </div>
            ))}
          </div>

          {/* Boutons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={revealAll}
              disabled={isRevealing}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {isRevealing ? 'Révélation...' : 'Révéler Tout'}
            </button>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full font-bold hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Nouveau Tirage
            </button>
          </div>

          {/* Grille de sélection */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Choisissez vos numéros
            </h3>
            
            {/* Numéros 1-49 */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[...Array(49)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => toggleNumber(i + 1)}
                  className={`p-2 rounded-lg font-bold transition-all ${
                    selectedNumbers.includes(i + 1)
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-gray-700/30 hover:bg-gray-700/50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Étoiles 1-12 */}
            <div className="flex justify-center gap-2">
              {[...Array(12)].map((_, i) => (
                <button
                  key={`star-${i + 1}`}
                  onClick={() => toggleStar(i + 1)}
                  className={`p-3 rounded-lg font-bold transition-all ${
                    selectedStars.includes(i + 1)
                      ? 'bg-yellow-600 text-white scale-110'
                      : 'bg-gray-700/30 hover:bg-gray-700/50'
                  }`}
                >
                  ⭐ {i + 1}
                </button>
              ))}
            </div>

            {/* Affichage de la sélection */}
            {(selectedNumbers.length > 0 || selectedStars.length > 0) && (
              <div className="mt-6 p-4 bg-black/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">Votre sélection:</p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">Numéros:</span>
                  {selectedNumbers.length > 0 ? selectedNumbers.sort((a, b) => a - b).join(', ') : 'Aucun'}
                  <span className="text-yellow-400 ml-4">Étoiles:</span>
                  {selectedStars.length > 0 ? selectedStars.sort((a, b) => a - b).join(', ') : 'Aucune'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">98.7%</p>
            <p className="text-sm text-gray-300">Satisfaction</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">2.4M €</p>
            <p className="text-sm text-gray-300">Gains distribués</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">⚡ 2.3s</p>
            <p className="text-sm text-gray-300">Temps moyen</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">24/7</p>
            <p className="text-sm text-gray-300">Support</p>
          </div>
        </div>

        {/* Tableau des gains */}
        <div className="mt-8 bg-white/10 backdrop-blur rounded-3xl p-6">
          <h3 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            💰 Tableau des Gains
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-3">Combinaison</th>
                  <th className="text-right p-3">Gain</th>
                  <th className="text-right p-3">Probabilité</th>
                </tr>
              </thead>
              <tbody>
                {prizeTable.map((row, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3">{row.match}</td>
                    <td className="text-right p-3 font-bold text-green-400">{row.prize}</td>
                    <td className="text-right p-3 text-gray-400">{row.odds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Web3 */}
      {showWeb3Modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-md mx-4 border border-purple-500/50 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">🌐 Mode Web3</h2>
            <p className="text-gray-300 mb-6">
              Connectez votre wallet pour accéder à l'expérience blockchain complète sur Shibarium !
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                <span className="text-2xl">🏗️</span>
                <div>
                  <p className="font-semibold">Parcelle Metaverse</p>
                  <p className="text-sm text-gray-400">Casino 3D sur SHIB Metaverse</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                <span className="text-2xl">💎</span>
                <div>
                  <p className="font-semibold">Gains en Crypto</p>
                  <p className="text-sm text-gray-400">SHIB, BONE, LEASH rewards</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-semibold">NFT Exclusifs</p>
                  <p className="text-sm text-gray-400">Collection limitée</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform">
                Connect Wallet
              </button>
              <button
                onClick={() => setShowWeb3Modal(false)}
                className="flex-1 py-3 bg-gray-700 rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App