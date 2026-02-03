.dashboard {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 640px) {
    .header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
}

.date {
    color: #6b7280;
    font-size: 0.875rem;
}

.statsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.statCard {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem !important;
}

.statIcon {
    width: 50px;
    height: 50px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.statIcon svg {
    width: 24px;
    height: 24px;
}

.statInfo {
    display: flex;
    flex-direction: column;
}

.statValue {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
}

.statLabel {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.section h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
}

.sectionHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.viewAll {
    color: #16a34a;
    font-size: 0.875rem;
    font-weight: 500;
}

.actionsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
}

.actionCard {
    text-align: center;
    padding: 1.5rem !important;
    cursor: pointer;
}

.actionIcon {
    width: 2rem;
    height: 2rem;
    color: #22c55e;
    margin-bottom: 0.75rem;
}

.actionCard h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
}

.actionCard p {
    font-size: 0.75rem;
    color: #6b7280;
}

.tableCard {
    overflow-x: auto;
    padding: 0 !important;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
}

.table th {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    background: #f9fafb;
}

.table td {
    font-size: 0.875rem;
    color: #374151;
}

.mealType {
    text-transform: capitalize;
}

.ratingBadge {
    padding: 0.25rem 0.5rem;
    background: #fef3c7;
    color: #b45309;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.time {
    color: #9ca3af;
}

// Admin Login Route
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});