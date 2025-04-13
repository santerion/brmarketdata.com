"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface ChartDataPoint {
  date: string
  price: number
}

interface Fundamental {
  ticker: string
  date: string
  key: string
  name: string
  value: number | null
}

const STOCKS = [
  { value: "PETR4", label: "Petrobrás (PETR4)" },
  { value: "KLBN11", label: "Klabin (KLBN11)" },
  { value: "VALE3", label: "Vale (VALE3)" },
  { value: "WEGE3", label: "WEG (WEGE3)" },
]

const TIME_RANGES = [
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "YTD", label: "YTD" },
  { value: "1y", label: "1Y" },
  { value: "5y", label: "5Y" },
  { value: "10y", label: "10Y" },
]

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--green))",
  },
} satisfies ChartConfig

// List of fundamentals to display
const FUNDAMENTALS_TO_SHOW = [
  "current_liquidity",
  "dividend_yield_last_12_months",
  "ebitda_margin",
  "ebit_margin",
  "ev_ebit",
  "ev_ebitda",
  "gross_margin",
  "growth_net_profit_last_5_years",
  "growth_net_revenue_last_5_years",
  "lpa",
  "net_margin",
  "p_asset_current_net",
  "p_assets",
  "payout",
  "p_ebit",
  "p_ebitda",
  "p_l",
  "psr",
  "p_vp",
  "p_working_capital",
  "roa",
  "roe",
  "roic",
  "vpa"
];

export default function Home() {
  const [selectedStock, setSelectedStock] = useState(STOCKS[0].value)
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGES[0].value)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [fundamentals, setFundamentals] = useState<Fundamental[]>([])
  const [loading, setLoading] = useState(false)
  const [fundamentalsLoading, setFundamentalsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fundamentalsError, setFundamentalsError] = useState<string | null>(null)

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

  // Fetch fundamentals data when stock changes
  useEffect(() => {
    const fetchFundamentals = async () => {
      setFundamentalsLoading(true)
      setFundamentalsError(null)
      
      try {
        const response = await fetch(
          `https://api.brmarketdata.com/fundamentals/by-ticker?ticker=${selectedStock}`,
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
        
        // Filter data to only show the fundamentals we want
        const filteredData = data.filter((item: Fundamental) => 
          FUNDAMENTALS_TO_SHOW.includes(item.key)
        )
        
        setFundamentals(filteredData)
      } catch (error) {
        console.error("Error fetching fundamentals:", error)
        setFundamentalsError(error instanceof Error ? error.message : "Failed to fetch fundamentals")
      } finally {
        setFundamentalsLoading(false)
      }
    }

    fetchFundamentals()
  }, [selectedStock])

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
          case "10y":
            startDate.setFullYear(startDate.getFullYear() - 10)
            break
          case "YTD":
            startDate.setFullYear(startDate.getFullYear())
            startDate.setMonth(0)
            startDate.setDate(1)
            break
        }

        const response = await fetch(
          `https://api.brmarketdata.com/prices/history?ticker=${selectedStock}&start=${format(startDate, "yyyy-MM-dd")}&end=${format(endDate, "yyyy-MM-dd")}`,
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
            <h1 className="text-6xl font-bold mb-6">🇧🇷 API de ações</h1>
            <p className="text-2xl text-muted-foreground mb-8">
              Acesse preços e indicadores históricos de ações brasileiras com nossa API
            </p>
            <Button size="lg" asChild>
              <Link href="#preco">Começar</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Por que escolher nossa API?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-4">Sem surpresas</h3>
                <p className="text-muted-foreground">
                  O que você vê é o que você vai receber. Não tem surpresas.
                  E o que você paga é claro e transparente.
                </p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-4">Dados históricos</h3>
                <p className="text-muted-foreground">
                  10 anos de dados históricos.
                  Tanto os preços quanto os +25 indicadores. Todos atualizados diariamente.
                </p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-4">Integração simples</h3>
                <p className="text-muted-foreground">
                  API REST com documentação clara e exemplos, e endpoints simples e intuitivos para acessar dados de ações brasileiras
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section className="py-20 px-0 bg-muted">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Veja funcionando</h2>
            <p className="text-center text-muted-foreground mb-8">
              Experimente o gráfico interativo e o painel de fundamentos abaixo - alimentados pela API.
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

              <div className="h-[250px] w-full">
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
                            formatter={(value, name) => {
                              if (name === "price") {
                                return `R$${Number(value).toFixed(2)}`
                              }
                              return [value, name];
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
                          strokeWidth: 0,
                          r: chartData.length > 100 ?
                            (chartData.length > 240 ?
                            (chartData.length > 480 ? 0 : 1) : 2) : 3
                        }}
                        activeDot={{
                          fill: getChartColor(),
                          stroke: "black",
                          strokeWidth: 2,
                          r: 5
                        }}
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </div>
              
              {chartData.length > 1 && (
                <div className="mt-4 text-center">
                  {(() => {
                    const firstPrice = chartData[0].price;
                    const lastPrice = chartData[chartData.length - 1].price;
                    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
                    const isPositive = percentChange >= 0;
                    
                    return (
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          (de {new Date(chartData[0].date).toLocaleDateString('pt-BR')} a {new Date(chartData[chartData.length - 1].date).toLocaleDateString('pt-BR')})
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            
            {/* Fundamentals Table */}
            <div className="mt-8 bg-card py-6 px-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Stock Fundamentals <span className="text-primary">{selectedStock}</span></h3>
              
              {fundamentalsError && (
                <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-lg text-center">
                  {fundamentalsError}
                </div>
              )}
              
              {fundamentalsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading fundamentals data...</p>
                  </div>
                </div>
              ) : (
                <>
                  
                  {fundamentals.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {fundamentals.map((fundamental) => {
                        
                        return (
                          <div key={fundamental.key} className="bg-card border border-border p-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                            <div className="font-medium text-xs mb-1 truncate" title={fundamental.name}>{fundamental.name}</div>
                            <div className={`text-right font-bold text-md`}>
                              {fundamental.value !== null 
                                ? fundamental.key.includes('margin') || fundamental.key.includes('dividend') || fundamental.key.includes('growth') || fundamental.key.includes('payout') || fundamental.key.includes('roic') || fundamental.key.includes('roa') || fundamental.key.includes('roe')
                                  ? `${fundamental.value.toFixed(2)}%`
                                  : fundamental.value.toFixed(2)
                                : '-'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No data available
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="preco" className="py-20 px-6 bg-muted">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Precificação simples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Básico</h3>
                <p className="text-4xl font-bold mb-4">R$49<span className="text-muted-foreground text-lg">/mês</span></p>
                <ul className="space-y-4 mb-8">
                  <li>10.000 chamadas por mês</li>
                  <li>Dados End of Day</li>
                  <li>25 indicadores</li>
                  <li>10 anos de dados históricos</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/contato">Começar</Link>
                </Button>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-lg border-2 border-primary">
                <h3 className="text-2xl font-bold mb-4">Avançado</h3>
                <p className="text-4xl font-bold mb-4">R$99<span className="text-muted-foreground text-lg">/mês</span></p>
                <ul className="space-y-4 mb-8">
                  <li>100.000 chamadas por mês</li>
                  <li>Dados End of Day</li>
                  <li>25 indicadores</li>
                  <li>10 anos de dados históricos</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/contato">Começar</Link>
                </Button>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Customizado</h3>
                <p className="text-4xl font-bold mb-4">Entre em contato</p>
                <ul className="space-y-2 mb-7">
                  <li>Chamadas ilimitadas</li>
                  <li>Dados End of Day</li>
                  <li>25 indicadores</li>
                  <li>10 anos de dados históricos</li>
                  <li>Suporte prioritário</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/contato">Entre em contato</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
            <p className="text-xl mb-8">
              Junte-se a centenas de desenvolvedores e empresas que usam nossa API para criar soluções incríveis e alimentar seus aplicativos.
            </p>
            <Button size="lg" className="border-2 border-primary" variant="outline" asChild>
              <Link href="/contato">Entre em contato</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
