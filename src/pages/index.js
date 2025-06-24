import CompactHeader from '@/components/Header/CompactHeader/CompactHeader'
import Header from '@/components/Header/MainHeader/Header'
import Header2 from '@/components/Header/SecondaryHeader/Header2'
import StockTable from '@/components/StockTable/StockTable'
import TrendingCoins from '@/components/TrendingCoins/TrendingCoins'
import { useTheme } from '@/utils/ThemeContext'
import styles from '../styles/home.module.css'

export default function Home() {
  const { isDarkMode } = useTheme()

  return (
    <div className={isDarkMode ? `${styles.darkMode}` : `${styles.lightMode}`}>
      <div className="d-xxl-block d-none">
        <Header />
        <Header2 />
      </div>
      <CompactHeader />
      <div className="row mx-2">
        <div className="col-xxl-3 col-md-4 col-sm-6">
          <TrendingCoins />
        </div>
        <div className="col-xxl-3 col-md-4 col-sm-6">
          <TrendingCoins />
        </div>
        <div className="col-xxl-3 col-md-4 d-md-block d-none">
          <TrendingCoins />
        </div>
        <div className="col-xxl-3 d-xxl-block d-none">
          <TrendingCoins />
        </div>
      </div>
      <StockTable />
      <br />
      <br />
      <br />
    </div>
  )
}
