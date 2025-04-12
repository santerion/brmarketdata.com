"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

interface ChartDataPoint {
  date: string
  price: number
}

const STOCKS = [
  { value: "PETR4", label: "Petrobrás (PETR4)" },
  { value: "KLBN11", label: "Klabin (KLBN11)" },
  { value: "VALE3", label: "Vale (VALE3)" },
]

const TIME_RANGES = [
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "1y", label: "1Y" },
  { value: "5y", label: "5Y" },
]

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--green))",
  },
} satisfies ChartConfig

export default function Home() {
  const [selectedStock, setSelectedStock] = useState(STOCKS[0].value)
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGES[0].value)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate Y-axis domain
  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 100]
    const minPrice = Math.min(...chartData.map(item => item.price))
    const maxPrice = Math.max(...chartData.map(item => item.price))
    const padding = (maxPrice - minPrice) * 0.1 // 10% padding
    return [minPrice - padding, maxPrice + padding]
  }

  // Determine chart color based on price movement
  const getChartColor = () => {
    if (chartData.length < 2) return "hsl(var(--green))"
    const firstPrice = chartData[0].price
    const lastPrice = chartData[chartData.length - 1].price
    return lastPrice < firstPrice ? "hsl(var(--red))" : "hsl(var(--green))"
  }

  // Update chart config with dynamic color
  const chartConfig = {
    price: {
      label: "Price",
      color: getChartColor(),
    },
    date: {
      label: "Date",
    }
  } satisfies ChartConfig

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const endDate = new Date()
        const startDate = new Date()
        
        switch (selectedTimeRange) {
          case "1m":
            startDate.setMonth(startDate.getMonth() - 1)
            break
          case "3m":
            startDate.setMonth(startDate.getMonth() - 3)
            break
          case "1y":
            startDate.setFullYear(startDate.getFullYear() - 1)
            break
          case "5y":
            startDate.setFullYear(startDate.getFullYear() - 5)
            break
        }

        const response = await fetch(
          `https://api.brmarketdata.com/prices?ticker=${selectedStock}&start=${format(startDate, "yyyy-MM-dd")}&end=${format(endDate, "yyyy-MM-dd")}`,
          {
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
            },
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Transform the data for the chart
        const transformedData = data.map((item: any) => ({
          date: new Date(item.date + 'T12:00:00.000Z'),
          price: item.price,
        }))
        
        setChartData(transformedData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedStock, selectedTimeRange])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-32 px-6 bg-gradient-to-br from-primary/15 to-primary/10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6">Brazilian Market Data API</h1>
            <p className="text-2xl text-muted-foreground mb-8">
              Access real-time and historical data for Brazilian stocks with our powerful API
            </p>
            <Button size="lg" asChild>
              <Link href="#pricing">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose Our API?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-4">Real-time Data</h3>
                <p className="text-muted-foreground">
                  Get up-to-the-minute stock prices and market data for Brazilian companies
                </p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-4">Historical Data</h3>
                <p className="text-muted-foreground">
                  Access years of historical data for backtesting and analysis
                </p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-4">Simple Integration</h3>
                <p className="text-muted-foreground">
                  RESTful API with clear documentation and examples
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section className="py-20 px-0 bg-muted">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Live Demo</h2>
            <p className="text-center text-muted-foreground mb-8">
              Try our API in action with this interactive chart
            </p>
            
            <div className="bg-card py-6 px-0 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Select a stock" />
                  </SelectTrigger>
                  <SelectContent>
                    {STOCKS.map((stock) => (
                      <SelectItem key={stock.value} value={stock.value}>
                        {stock.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  {TIME_RANGES.map((range) => (
                    <Button
                      key={range.value}
                      variant={selectedTimeRange === range.value ? "default" : "outline"}
                      onClick={() => setSelectedTimeRange(range.value)}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-lg text-center">
                  {error}
                </div>
              )}

              <div className="h-[500px] w-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ChartContainer config={chartConfig} className="h-full w-full px-2 mx-auto">
                    <AreaChart data={chartData} margin={{ left: 5, right: 10, top: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={getChartColor()} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      {/* 3 3 means 3px dash, 3px gap */}
                      <CartesianGrid 
                        strokeDasharray="5 3"
                        horizontal={true}
                        vertical={true}
                        stroke="rgba(120, 120, 120, 0.4)"
                      />
                      <XAxis
                        dataKey="date"
                        tickCount={6}
                        tickFormatter={(date) => {
                          const dates = new Date(date)
                          let res = dates.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                          if (chartData.length > 100) {
                            res = dates.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
                          }
                          if (chartData.length > 400) {
                            res = dates.getFullYear().toString()
                          }
                          return res
                        }}
                      />
                      <YAxis 
                        domain={getYAxisDomain()}
                        tickCount={6}
                        ticks={chartData.length > 0 ? [
                          Math.min(...chartData.map(item => item.price)),
                          ...Array(4).fill(0).map((_, i) => {
                            const min = Math.min(...chartData.map(item => item.price));
                            const max = Math.max(...chartData.map(item => item.price));
                            const step = (max - min) / 5;
                            return min + step * (i + 1);
                          }),
                          Math.max(...chartData.map(item => item.price))
                        ] : undefined}
                        tickFormatter={(value) => `R$${value.toFixed(2)}`}
                      />
                      <ChartTooltip 
                        content={
                          <ChartTooltipContent 
                            labelFormatter={(_, payload) => {
                              if (!payload?.[0]?.payload?.date) return "";
                              const date = payload[0].payload.date;
                              let res = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                              if (chartData.length > 100) {
                                res = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                              }
                              return res;
                            }}
                          />
                        } 
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={getChartColor()}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        dot={{
                          fill: getChartColor(),
                          stroke: "black",
                          strokeWidth: chartData.length > 100 ? 0 : 1,
                          r: chartData.length > 100 ? 0 : 3
                        }}
                        activeDot={{
                          fill: getChartColor(),
                          stroke: "black",
                          strokeWidth: 3,
                          r: 6
                        }}
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Starter</h3>
                <p className="text-4xl font-bold mb-4">$49<span className="text-muted-foreground text-lg">/month</span></p>
                <ul className="space-y-4 mb-8">
                  <li>100,000 API calls/month</li>
                  <li>Real-time data</li>
                  <li>1 year historical data</li>
                  <li>Email support</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-lg border-2 border-primary">
                <h3 className="text-2xl font-bold mb-4">Professional</h3>
                <p className="text-4xl font-bold mb-4">$99<span className="text-muted-foreground text-lg">/month</span></p>
                <ul className="space-y-4 mb-8">
                  <li>500,000 API calls/month</li>
                  <li>Real-time data</li>
                  <li>5 years historical data</li>
                  <li>Priority support</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <p className="text-4xl font-bold mb-4">Custom</p>
                <ul className="space-y-4 mb-8">
                  <li>Unlimited API calls</li>
                  <li>Real-time data</li>
                  <li>Full historical data</li>
                  <li>Dedicated support</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-6 bg-secondary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8">
              Join hundreds of developers and businesses using our API to power their applications
            </p>
            <Button size="lg" className="border-2 border-primary" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
