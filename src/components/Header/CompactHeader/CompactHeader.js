import styles from './CompactHeader.module.css'

function CompactHeader() {
  return (
    <div
      className={`${styles.compactHeader} d-xxl-none d-flex justify-content-between align-items-center px-3 py-2 border-bottom`}
    >
      <div className="d-flex align-items-center gap-2">
        <img
          src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/coinmarketcap-pqt6lgoh0ghwcrt36d3j79.png/coinmarketcap-agqsbhcdw5syj5e0mnvcli.png?_a=DATAdtAAZAA0"
          alt="CMC"
          height={30}
        />
        <span className={styles.logoText}>CoinMarketCap</span>
        <span className={`${styles.dominance} d-sm-block d-none`}>
          Dominance: <a className="text-primary">BTC: 64.9% ETH: 8.7%</a>
        </span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <i className="fa fa-search text-secondary fs-5" />
        <i className="fa fa-diamond text-secondary fs-5"></i>
        <i className="fa fa-bars text-secondary fs-5" />
      </div>
    </div>
  )
}

export default CompactHeader
