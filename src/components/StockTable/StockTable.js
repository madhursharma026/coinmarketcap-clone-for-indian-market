import { useTheme } from '@/utils/ThemeContext'
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

  const { isDarkMode } = useTheme()

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
      <div
        className={`d-flex flex-column ${
          isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'
        }`}
        style={{ minHeight: '50vh', overflow: 'hidden' }} // Adjust minHeight as per your design
      >
        <div className="flex-fill d-flex justify-content-center align-items-center">
          <Alert
            variant={isDarkMode ? 'dark' : 'danger'}
            className="text-center p-4 w-75"
          >
            <h4>Something went wrong!</h4>
            <p className="mb-0">{error}</p>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={`${
          styles.tableWrapper
        } table-responsive rounded-0 mt-4 mx-3 ${
          isDarkMode ? styles.darkTableWrapper : ''
        }`}
      >
        <Table
          className={`table-borderless align-middle ${styles.cleanTable} ${
            isDarkMode ? styles.darkTable : ''
          }`}
        >
          <thead
            className={`${styles.tableHeader} ${
              isDarkMode ? styles.darkTableHeader : ''
            }`}
          >
            <tr>
              <th>#</th>
              <th className={`${styles.textColor} text-start fw-bold`}>
                Company
              </th>
              <th className={`${styles.textColor} text-end fw-bold`}>
                Price (₹)
              </th>
              <th className={`${styles.textColor} text-end fw-bold`}>
                Change (₹)
              </th>
              <th className={`${styles.textColor} text-end fw-bold`}>
                Change (%)
              </th>
              <th className={`${styles.textColor} text-end fw-bold`}>Open</th>
              <th className={`${styles.textColor} text-end fw-bold`}>High</th>
              <th className={`${styles.textColor} text-end fw-bold`}>Low</th>
              <th className={`${styles.textColor} text-end fw-bold`}>Volume</th>
              <th className={`${styles.textColor} text-end fw-bold`}>
                Trade Value
              </th>
              <th className={`${styles.textColor} text-end fw-bold`}>
                52W High
              </th>
              <th className={`${styles.textColor} text-end fw-bold`}>
                52W Low
              </th>
              <th className={`${styles.textColor} text-center fw-bold`}>
                Chart
              </th>
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
                <td className={`text-end ${styles.textColor}`}>
                  ₹{format(stock.lastPrice)}
                </td>
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
                <td className={`text-end ${styles.textColor}`}>
                  ₹{format(stock.open)}
                </td>
                <td className={`text-end ${styles.textColor}`}>
                  ₹{format(stock.dayHigh)}
                </td>
                <td className={`text-end ${styles.textColor}`}>
                  ₹{format(stock.dayLow)}
                </td>
                <td className={`text-end ${styles.textColor}`}>
                  {format(stock.totalTradedVolume)}
                </td>
                <td className={`text-end ${styles.textColor}`}>
                  ₹{format(stock.totalTradedValue)}
                </td>
                <td className={`text-end ${styles.textColor}`}>
                  ₹{format(stock.yearHigh)}
                </td>
                <td className={`text-end ${styles.textColor}`}>
                  ₹{format(stock.yearLow)}
                </td>
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

      {totalPages > 1 && (
        <Pagination className={`d-flex justify-content-center mt-3`}>
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />

          {currentPage > 2 && (
            <>
              <Pagination.Item onClick={() => handlePageChange(1)}>
                1
              </Pagination.Item>
              {currentPage > 3 && <Pagination.Ellipsis disabled />}
            </>
          )}

          {[currentPage - 1, currentPage, currentPage + 1]
            .filter((page) => page > 1 && page < totalPages)
            .map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Pagination.Item>
            ))}

          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
              <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </Pagination.Item>
            </>
          )}

          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </>
  )
}
