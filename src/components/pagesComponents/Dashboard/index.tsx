
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/components/charts/StatsCard'
import dashboardHero from '@/assets/dashboard-hero.jpg'
import { useTranslation } from 'react-i18next'
import { AnalyticsBarChart } from '@/components/charts/BarChart'
import { AnalyticsLineChart } from '@/components/charts/LinerChart'

const userActivityData = [
  { day: 'Mon', users: 1200 },
  { day: 'Tue', users: 1900 },
  { day: 'Wed', users: 800 },
  { day: 'Thu', users: 1600 },
  { day: 'Fri', users: 2200 },
  { day: 'Sat', users: 1400 },
  { day: 'Sun', users: 1000 },
]
const revenue = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
]

export function Dashboard() {
  const { t } = useTranslation()

  const stats = [
    {
      title: t('totalRevenue'),
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'increase' as const,
      icon: DollarSign,
    },
    {
      title: t('activeUsers'),
      value: '2,350',
      change: '+180.1%',
      changeType: 'increase' as const,
      icon: Users,
    },
    {
      title: t('sales'),
      value: '+12,234',
      change: '+19%',
      changeType: 'increase' as const,
      icon: Activity,
    },
    {
      title: t('conversionRate'),
      value: '3.2%',
      change: '-4.3%',
      changeType: 'decrease' as const,
      icon: TrendingUp,
    },
  ]
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-hero p-8 text-white">
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">{t('welcomeBack')}</h1>
          <p className="text-lg opacity-90">{t('businessToday')}</p>
        </div>
        <div className="absolute inset-0 opacity-20">
          <img
            src={dashboardHero}
            alt="Dashboard analytics"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <AnalyticsLineChart
          title={t('revenueOverview')}
          description={t('monthlyRevenue')}
          data={revenue}
          xAxisKey="month"
          lines={[{ dataKey: 'revenue', stroke: 'hsl(var(--primary))' }]}
          className="col-span-4"
        />

        <AnalyticsBarChart
          title="User Activity"
          description="Daily active users this week"
          data={userActivityData}
          xAxisKey="day"
          barConfig={{
            dataKey: 'users',
            fill: 'hsl(var(--primary))',
            radius: [4, 4, 0, 0],
          }}
          className="col-span-3"
        />
      </div>
    </div>
  )
}
