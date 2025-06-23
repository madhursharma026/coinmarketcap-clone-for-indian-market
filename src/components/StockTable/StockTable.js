import { useEffect, useState } from 'react'
import { Alert, Pagination, Spinner, Table } from 'react-bootstrap'
import styles from './StockTable.module.css'

const format = (num) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(num)

const ITEMS_PER_PAGE = 50

export default function StockTable() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetch('/api/stocks')
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Unauthorized access: NSE API returned 401')
          }
          throw new Error('API request failed')
        }
        return res.json()
      })
      .then((data) => {
        setStocks(Array.isArray(data?.data) ? data.data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message || 'Failed to load stock data')
        setLoading(false)
      })
  }, [])

  const totalPages = Math.ceil(stocks.length / ITEMS_PER_PAGE)
  const paginatedStocks = stocks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum)
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4 text-center">
        {error}
      </Alert>
    )
  }

  return (
    <>
      <div className={`${styles.tableWrapper} table-responsive mt-4`}>
        <Table className={`table-borderless align-middle ${styles.cleanTable}`}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>#</th>
              <th className="text-start fw-bold">Company</th>
              <th className="text-end fw-bold">Price (₹)</th>
              <th className="text-end fw-bold">Change (₹)</th>
              <th className="text-end fw-bold">Change (%)</th>
              <th className="text-end fw-bold">Open</th>
              <th className="text-end fw-bold">High</th>
              <th className="text-end fw-bold">Low</th>
              <th className="text-end fw-bold">Volume</th>
              <th className="text-end fw-bold">Trade Value</th>
              <th className="text-end fw-bold">52W High</th>
              <th className="text-end fw-bold">52W Low</th>
              <th className="text-center fw-bold">Chart</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStocks.map((stock, index) => (
              <tr key={stock.symbol} className={styles.tableRow}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>
                  <div className={styles.companyCell}>
                    <div className={styles.symbolText}>{stock.symbol}</div>
                    <div className={styles.companyName}>
                      {stock.meta?.companyName || '-'}
                    </div>
                  </div>
                </td>
                <td className="text-end">₹{format(stock.lastPrice)}</td>
                <td
                  className={`text-end ${
                    stock.change >= 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  {stock.change >= 0 ? '▲' : '▼'} {format(stock.change)}
                </td>
                <td
                  className={`text-end ${
                    stock.pChange >= 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  {stock.pChange >= 0 ? '▲' : '▼'} {format(stock.pChange)}%
                </td>
                <td className="text-end">₹{format(stock.open)}</td>
                <td className="text-end">₹{format(stock.dayHigh)}</td>
                <td className="text-end">₹{format(stock.dayLow)}</td>
                <td className="text-end">{format(stock.totalTradedVolume)}</td>
                <td className="text-end">₹{format(stock.totalTradedValue)}</td>
                <td className="text-end">₹{format(stock.yearHigh)}</td>
                <td className="text-end">₹{format(stock.yearLow)}</td>
                <td className="text-center">
                  {stock.chartTodayPath ? (
                    <img
                      src={stock.chartTodayPath}
                      alt="chart"
                      height={30}
                      className={styles.chartImg}
                    />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </>
  )
}
