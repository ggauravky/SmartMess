import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiMail, FiLock, FiArrowLeft, FiShield } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'
import styles from './AdminLogin.module.css'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { adminLogin, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await adminLogin(formData.email, formData.password)
      toast.success('Welcome, Admin! 🛡️')
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.adminLoginPage}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Back to home
        </Link>

        <div className={styles.loginCard}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <FiShield className={styles.shieldIcon} />
            </div>
            <h1>Admin Portal</h1>
            <p>Sign in to manage SmartMess</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Admin Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@smartmess.com"
              icon={FiMail}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FiLock}
              error={errors.password}
            />

            <Button type="submit" fullWidth loading={loading} size="large">
              Sign In as Admin
            </Button>
          </form>

          <div className={styles.footer}>
            <p>Not an admin?</p>
            <Link to="/login" className={styles.link}>
              Student Login →
            </Link>
          </div>
        </div>

        <div className={styles.info}>
          <h3>🔐 Admin Access Only</h3>
          <p>This portal is restricted to authorized mess administrators only.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
