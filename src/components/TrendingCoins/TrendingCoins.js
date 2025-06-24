import { useTheme } from '@/utils/ThemeContext'
import styles from './TrendingCoins.module.css'

const data = [
  {
    id: 1,
    name: 'BTC',
    price: '$101,624.9',
    change: 2.17,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  },
  {
    id: 2,
    name: 'FUN',
    price: '$0.011',
    change: 49.03,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1757.png',
  },
  {
    id: 3,
    name: 'MOVE',
    price: '$0.1484',
    change: 27.37,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png',
  },
  {
    id: 4,
    name: 'BULLA',
    price: '$0.05349',
    change: -32.43,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28841.png',
  },
  {
    id: 5,
    name: 'PROM',
    price: '$4.03',
    change: -21.03,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/12939.png',
  },
]

export default function TrendingCoins() {
  const { isDarkMode } = useTheme()

  return (
    <div className={`${styles.card} ${isDarkMode ? styles.darkCard : ''} my-3`}>
      <div className={styles.header}>
        <span className={styles.title}>Trending Coins</span>
        <div className={styles.actions}>
          <i className="bi bi-fire"></i>
          <i className="bi bi-eye"></i>
          <i className="bi bi-eye-slash"></i>
        </div>
      </div>

      <ul className={styles.list}>
        {data.map((coin) => (
          <li key={coin.id} className={styles.row}>
            <span className={styles.rank}>{coin.id}</span>
            <img src={coin.icon} alt={coin.name} className={styles.icon} />
            <span className={styles.name}>{coin.name}</span>
            <span className={styles.price}>{coin.price}</span>
            <span
              className={`${styles.change} d-xl-block d-none ${
                coin.change >= 0 ? styles.up : styles.down
              }`}
            >
              {coin.change >= 0 ? '▲' : '▼'} {Math.abs(coin.change).toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
