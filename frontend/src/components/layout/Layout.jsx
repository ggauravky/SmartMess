import Navbar from './Navbar'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>© 2024 SmartMess. Made with ❤️ for better campus dining.</p>
      </footer>
    </div>
  )
}

export default Layout
