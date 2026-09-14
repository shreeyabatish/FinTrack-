import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import { useFinance } from '../context/FinanceContext.jsx'
import '../styles/Analytics.css'

const COLORS = ['#2e7d5b', '#dc3545', '#e6a817', '#6c757d', '#8fae9a', '#d9834f']

export default function Analytics() {
  const { transactions, totals, spentByCategory } = useFinance()

  const incomeVsExpense = [
    { name: 'Income', value: totals.income },
    { name: 'Expense', value: totals.expense },
  ]

  const categoryData = Object.entries(spentByCategory).map(([name, value]) => ({ name, value }))

  const dailyMap = {}
  transactions.forEach((t) => {
    if (!dailyMap[t.date]) dailyMap[t.date] = { date: t.date, net: 0 }
    dailyMap[t.date].net += t.type === 'income' ? t.amount : -t.amount
  })
  const dailyTrend = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date))

  const savingsRate = totals.income ? Math.round((totals.balance / totals.income) * 100) : 0
  const sortedCategories = [...categoryData].sort((a, b) => b.value - a.value)
  const topCategory = sortedCategories[0]

  return (
    <div>
      <h1>Analytics</h1>

      <div className="chart-grid">
        <div className="chart-box">
          <h3>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={incomeVsExpense}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => '₹' + v.toLocaleString('en-IN')} />
              <Bar dataKey="value">
                {incomeVsExpense.map((entry, i) => (
                  <Cell key={entry.name} fill={i === 0 ? '#2e7d5b' : '#dc3545'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80}>
                {categoryData.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => '₹' + v.toLocaleString('en-IN')} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box" style={{ marginBottom: 15 }}>
        <h3>Daily Net (Income - Expense)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(v) => '₹' + v.toLocaleString('en-IN')} />
            <Line type="monotone" dataKey="net" stroke="#2e7d5b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h3>Financial Insights</h3>
        <ul className="insights-list">
          <li>Savings rate is {savingsRate}% of income.</li>
          {topCategory && (
            <li>
              {topCategory.name} is the biggest expense category at ₹{topCategory.value.toLocaleString('en-IN')}.
            </li>
          )}
          <li>
            Current balance is ₹{totals.balance.toLocaleString('en-IN')} across {transactions.length} transactions.
          </li>
        </ul>
      </div>
    </div>
  )
}
