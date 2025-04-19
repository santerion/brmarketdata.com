"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { format, parse, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { DatePicker } from "@/components/ui/date-picker"

interface ChartDataPoint {
  date: Date
  portfolioValue: number
  contributions: number
  shares: number
  price: number
}

const STOCKS = [
  { value: "PETR4", label: "Petrobrás (PETR4)" },
  { value: "KLBN11", label: "Klabin (KLBN11)" },
  { value: "VALE3", label: "Vale (VALE3)" },
  { value: "WEGE3", label: "WEG (WEGE3)" },
]

const chartConfig = {
  portfolioValue: {
    label: "Valor do Portfólio",
    color: "hsl(var(--green))",
  },
  contributions: {
    label: "Contribuições",
    color: "hsl(var(--red))",
  },
} satisfies ChartConfig

export default function Simulator() {
  const [selectedStock, setSelectedStock] = useState(STOCKS[0].value)
  const [initialContribution, setInitialContribution] = useState("10000")
  const [monthlyContribution, setMonthlyContribution] = useState("1000")
  const [startDate, setStartDate] = useState("2020-01")
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM"))
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalShares, setTotalShares] = useState<number>(0)
  const [averagePrice, setAveragePrice] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const start = parse(startDate, "yyyy-MM", new Date())
        const end = parse(endDate, "yyyy-MM", new Date())
        
        // Add one month to end date to include the current month
        // This allows us to calculate the, for example, April contribution using the April 1st price.
        end.setMonth(end.getMonth() + 1)
        
        const response = await fetch(
          `https://api.brmarketdata.com/prices/history?ticker=${selectedStock}&start=${format(start, "yyyy-MM-dd")}&end=${format(end, "yyyy-MM-dd")}`,
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
        
        // Process the data to calculate portfolio value over time
        const processedData: ChartDataPoint[] = []
        let shares = 0
        let totalInvested = 0
        let totalCost = 0
        let remainingMoney = 0 // Track money that couldn't be invested in whole shares
        
        // Sort data by date
        const sortedData = data.sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        
        // Get first day of each month
        const monthlyData = sortedData.filter((item: any, index: number, array: any[]) => {
          if (index === 0) return true
          const currentDate = new Date(item.date)
          const prevDate = new Date(array[index - 1].date)
          return currentDate.getMonth() !== prevDate.getMonth()
        })
        
        // Calculate portfolio value over time
        monthlyData.forEach((item: any, index: number) => {
          const date = new Date(item.date)
          const price = item.price
          
          // Calculate available money for this month
          let availableMoney = remainingMoney
          if (index === 0) {
            availableMoney += Number(initialContribution)
            totalInvested += Number(initialContribution)
          } else {
            availableMoney += Number(monthlyContribution)
            totalInvested += Number(monthlyContribution)
          }
          
          // Calculate how many whole shares we can buy
          const sharesToBuy = Math.floor(availableMoney / price)
          const cost = sharesToBuy * price
          
          // Update remaining money for next month
          remainingMoney = availableMoney - cost
          
          // Update total shares and cost
          shares += sharesToBuy
          totalCost += cost
          
        //   console.log(`Month ${index + 1}:`, {
        //     date: format(date, 'MMM/yy'),
        //     price: price.toFixed(2),
        //     availableMoney: availableMoney.toFixed(2),
        //     sharesToBuy,
        //     cost: cost.toFixed(2),
        //     remainingMoney: remainingMoney.toFixed(2),
        //     totalShares: shares,
        //     totalInvested: totalInvested.toFixed(2),
        //     portfolioValue: (shares * price).toFixed(2)
        //   })
          
          processedData.push({
            date,
            portfolioValue: shares * price,
            contributions: totalInvested,
            shares,
            price
          })
        })
        
        setChartData(processedData)
        setTotalShares(shares)
        setAveragePrice(totalCost / shares)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedStock, initialContribution, monthlyContribution, startDate, endDate])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Simulador de Investimentos</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="initialContribution">Aporte Inicial (R$)</Label>
                  <Input
                    id="initialContribution"
                    type="number"
                    value={initialContribution}
                    onChange={(e) => setInitialContribution(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthlyContribution">Aporte Mensal (R$)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock">Ação</Label>
                  <Select value={selectedStock} onValueChange={setSelectedStock}>
                    <SelectTrigger>
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
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">Data Final</Label>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="h-[400px] w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-full w-full px-2 mx-auto">
                  <AreaChart data={chartData} margin={{ left: 5, right: 10, top: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--green))" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="hsl(var(--green))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--red))" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="hsl(var(--red))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="5 3"
                      horizontal={true}
                      vertical={true}
                      stroke="rgba(120, 120, 120, 0.4)"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(date, "MMM/yy", { locale: ptBR })}
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent 
                          labelFormatter={(_, payload) => {
                            if (!payload?.[0]?.payload?.date) return "";
                            return format(payload[0].payload.date, "MMM/yy", { locale: ptBR });
                          }}
                          formatter={(value, name) => {
                            return [`R$${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name === "portfolioValue" ? "Valor do Portfólio" : "Contribuições"];
                          }}
                        />
                      } 
                    />
                    <Area
                      type="monotone"
                      dataKey="portfolioValue"
                      stroke="hsl(var(--green))"
                      fillOpacity={1}
                      fill="url(#colorPortfolio)"
                    />
                    <Area
                      type="monotone"
                      dataKey="contributions"
                      stroke="hsl(var(--red))"
                      fillOpacity={1}
                      fill="url(#colorContributions)"
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </div>

            {chartData.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Total Investido</h3>
                  <p className="text-2xl font-bold">
                    R${Number(chartData[chartData.length - 1].contributions).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Valor Atual</h3>
                  <p className="text-2xl font-bold">
                    R${Number(chartData[chartData.length - 1].portfolioValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Ações Acumuladas</h3>
                  <p className="text-2xl font-bold">
                    {totalShares.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Preço Médio</h3>
                  <p className="text-2xl font-bold">
                    R${averagePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Preço {format(chartData[chartData.length - 1].date, 'MMM/yy')}</h3>
                  <p className="text-2xl font-bold">
                    R${chartData[chartData.length - 1].price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Rentabilidade</h3>
                  <p className="text-2xl font-bold">
                    {(((chartData[chartData.length - 1].portfolioValue / chartData[chartData.length - 1].contributions) - 1) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 