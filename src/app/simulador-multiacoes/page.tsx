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
  shares?: number
  price?: number
}

const STOCKS = [
  { value: "PETR4", label: "Petrobrás (PETR4)" },
  { value: "KLBN11", label: "Klabin (KLBN11)" },
  { value: "VALE3", label: "Vale (VALE3)" },
  { value: "WEGE3", label: "WEG (WEGE3)" },
  { value: "B3SA3", label: "B3 (B3SA3)" },
  { value: "BBAS3", label: "BB (BBAS3)" },
  { value: "ITSA4", label: "Itausa (ITSA4)" },
]

const chartConfig = {
  portfolioValue: {
    label: " Valor do Portfólio",
    color: "hsl(var(--green))",
  },
  contributions: {
    label: " Desembolso",
    color: "hsl(var(--blue))",
  },
} satisfies ChartConfig

export default function Simulator() {
  const [selectedStocks, setSelectedStocks] = useState<
    { value: string; label: string; allocation: number }[]
  >([{ value: "PETR4", label: "Petrobrás (PETR4)", allocation: 100 }])
  const [stockToAdd, setStockToAdd] = useState<string>(STOCKS.find(s => s.value !== selectedStocks[0].value)?.value || "")
  const [allocationToAdd, setAllocationToAdd] = useState<string>("0")
  const [allocationError, setAllocationError] = useState<string | null>(null)
  const [initialContribution, setInitialContribution] = useState("1000")
  const [monthlyContribution, setMonthlyContribution] = useState("1000")
  const [startDate, setStartDate] = useState("2017-01")
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM"))
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalShares, setTotalShares] = useState<number>(0)
  const [averagePrice, setAveragePrice] = useState<number>(0)

  const handleAddStock = () => {
    if (!stockToAdd) return
    if (selectedStocks.length >= 5) {
      setAllocationError("Você pode selecionar no máximo 5 ações.")
      return
    }
    if (selectedStocks.some(s => s.value === stockToAdd)) {
      setAllocationError("Esta ação já foi adicionada.")
      return
    }
    const allocation = parseFloat(allocationToAdd)
    if (isNaN(allocation) || allocation <= 0 || allocation > 100) {
      setAllocationError("Alocação deve ser um número positivo até 100.")
      return
    }

    const stockInfo = STOCKS.find(s => s.value === stockToAdd)
    if (!stockInfo) return

    setSelectedStocks([...selectedStocks, { ...stockInfo, allocation }])
    setAllocationToAdd("0")
    setAllocationError(null)
    const nextStock = STOCKS.find(s => !selectedStocks.some(sel => sel.value === s.value) && s.value !== stockInfo.value)
    setStockToAdd(nextStock?.value || "")
  }

  const handleRemoveStock = (valueToRemove: string) => {
    setSelectedStocks(selectedStocks.filter(s => s.value !== valueToRemove))
    setAllocationError(null)
  }

  const handleUpdateAllocation = (valueToUpdate: string, newAllocationStr: string) => {
    if (newAllocationStr === "") {
      setSelectedStocks(
        selectedStocks.map(s =>
          s.value === valueToUpdate ? { ...s, allocation: 0 } : s
        )
      )
      setAllocationError(null)
      return
    }

    const newAllocation = parseFloat(newAllocationStr)
    if (isNaN(newAllocation) || newAllocation < 0 || newAllocation > 100) {
      setAllocationError("Alocação deve ser entre 0 e 100.")
      setSelectedStocks(
        selectedStocks.map(s =>
          s.value === valueToUpdate ? { ...s, allocation: Math.max(0, Math.min(100, newAllocation || 0)) } : s
        )
      )
      return
    }

    setSelectedStocks(
      selectedStocks.map(s =>
        s.value === valueToUpdate ? { ...s, allocation: newAllocation } : s
      )
    )
    setAllocationError(null)
  }

  const totalAllocation = selectedStocks.reduce((sum, stock) => sum + stock.allocation, 0)

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStocks.length === 0) {
        setChartData([])
        setTotalShares(0)
        setAveragePrice(0)
        setError("Selecione pelo menos uma ação.")
        setLoading(false)
        return
      }

      if (Math.abs(totalAllocation - 100) > 0.01 && selectedStocks.length > 0) {
        setError("A soma das alocações deve ser 100%.")
        setChartData([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      console.log("Fetching for:", selectedStocks, "Total Allocation:", totalAllocation)

      try {
        const [startYear, startMonth] = startDate.split("-")
        const [endYear, endMonth] = endDate.split("-")
        const startLimit = startOfMonth(new Date(parseInt(startYear), parseInt(startMonth) - 1, 1, 0, 0, 0))
        const endLimit = endOfMonth(new Date(parseInt(endYear), parseInt(endMonth) - 1, 1, 23, 59, 59))

        const fetchPromises = selectedStocks.map(stock =>
          fetch(
            `https://api.brmarketdata.com/prices/history?ticker=${stock.value}&start=${format(startLimit, "yyyy-MM-dd")}&end=${format(endLimit, "yyyy-MM-dd")}`,
            { mode: "cors", headers: { "Accept": "application/json" } }
          ).then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status} for ${stock.value}`)
            }
            return res.json()
          }).then(data => ({ ticker: stock.value, data }))
        )

        const results = await Promise.all(fetchPromises)

        const stockDataMap: { [ticker: string]: { date: Date; price: number }[] } = {}
        const allMonthlyDates = new Set<number>()

        results.forEach(result => {
          const sortedData = result.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          const dateFilteredData = sortedData.filter((item: any) => {
            const itemDate = new Date(item.date)
            return !isNaN(itemDate.getTime()) && itemDate >= startLimit && itemDate <= endLimit
          })

          const monthlyEntries: { date: Date; price: number }[] = []
          const seenMonths = new Set<string>()

          dateFilteredData.forEach((item: any) => {
            const itemDate = new Date(item.date)
            if (!isNaN(itemDate.getTime())) {
              const monthKey = format(itemDate, "yyyy-MM")
              if (!seenMonths.has(monthKey)) {
                const dateObj = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate(), 12, 0, 0)
                monthlyEntries.push({ date: dateObj, price: item.price })
                allMonthlyDates.add(dateObj.getTime())
                seenMonths.add(monthKey)
              }
            }
          })
          stockDataMap[result.ticker] = monthlyEntries
        })

        const sortedUniqueDates = Array.from(allMonthlyDates).sort().map(ts => new Date(ts))

        if (sortedUniqueDates.length === 0) {
          setError("Nenhum dado de preço encontrado para o período selecionado.")
          setChartData([])
          setLoading(false)
          return
        }

        const processedData: ChartDataPoint[] = []
        let heldShares: { [ticker: string]: number } = {}
        selectedStocks.forEach(s => heldShares[s.value] = 0)
        let totalInvested = 0
        let remainingMoney = 0

        sortedUniqueDates.forEach((currentDate, index) => {
          const contribution = (index === 0 ? Number(initialContribution) : Number(monthlyContribution))
          let availableMoney = remainingMoney + contribution
          totalInvested += contribution
          remainingMoney = 0

          let monthPortfolioValue = 0

          selectedStocks.forEach(stock => {
            const allocationPercent = stock.allocation / 100
            const moneyForThisStock = availableMoney * allocationPercent

            const monthlyStockInfo = stockDataMap[stock.value]?.find(
              entry => entry.date.getTime() === currentDate.getTime()
            )
            const price = monthlyStockInfo?.price

            if (price && price > 0) {
              const sharesToBuy = Math.floor(moneyForThisStock / price)
              const cost = sharesToBuy * price
              heldShares[stock.value] += sharesToBuy
              remainingMoney += (moneyForThisStock - cost)
            } else {
              remainingMoney += moneyForThisStock
            }
          })

          selectedStocks.forEach(stock => {
            const currentPrice = stockDataMap[stock.value]?.find(entry => entry.date.getTime() === currentDate.getTime())?.price
            if (currentPrice && heldShares[stock.value] > 0) {
              monthPortfolioValue += heldShares[stock.value] * currentPrice
            }
          })

          processedData.push({
            date: currentDate,
            portfolioValue: monthPortfolioValue,
            contributions: totalInvested,
          })
        })

        setChartData(processedData)
        setTotalShares(0)
        setAveragePrice(0)
      } catch (err) {
        console.error("Error during simulation:", err)
        setError(err instanceof Error ? err.message : "Falha ao calcular simulação.")
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedStocks, initialContribution, monthlyContribution, startDate, endDate, totalAllocation])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Simulador de Aportes (multiacões)</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="initialContribution">Aporte Inicial (R$)</Label>
                  <Input
                    id="initialContribution"
                    type="number"
                    value={initialContribution}
                    onChange={(e) => setInitialContribution(e.target.value)}
                    min="0"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthlyContribution">Aporte Mensal (R$)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    min="0"
                    className="w-full"
                  />
                </div>
                
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
              
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-xl font-semibold mb-2">Seleção de Ações (Até 5)</h2>

                <div className="space-y-2 mb-4">
                  {selectedStocks.map((stock) => (
                    <div key={stock.value} className="flex items-center gap-2 p-2 border rounded-md bg-card">
                      <span className="flex-grow font-medium">{stock.label}</span>
                      <Input
                        type="number"
                        value={stock.allocation.toString()}
                        onChange={(e) => handleUpdateAllocation(stock.value, e.target.value)}
                        className="w-20 text-right"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      <span className="text-muted-foreground">%</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveStock(stock.value)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        <span className="sr-only">Remover</span>
                      </Button>
                    </div>
                  ))}
                </div>

                {selectedStocks.length < 5 && (
                  <div className="flex items-end gap-2 p-3 border border-dashed rounded-md">
                    <div className="flex-grow">
                      <Label htmlFor="stockToAdd">Adicionar Ação</Label>
                      <Select value={stockToAdd} onValueChange={setStockToAdd}>
                        <SelectTrigger id="stockToAdd">
                          <SelectValue placeholder="Selecione uma ação" />
                        </SelectTrigger>
                        <SelectContent>
                          {STOCKS.filter(
                            (stock) => !selectedStocks.some(s => s.value === stock.value)
                          ).map((stock) => (
                            <SelectItem key={stock.value} value={stock.value}>
                              {stock.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24 flex-shrink-0">
                      <Label htmlFor="allocationToAdd">Alocação (%)</Label>
                      <Input
                        id="allocationToAdd"
                        type="number"
                        value={allocationToAdd}
                        onChange={(e) => setAllocationToAdd(e.target.value)}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full text-right"
                      />
                    </div>
                    <Button onClick={handleAddStock} disabled={!stockToAdd || selectedStocks.length >= 5 || parseFloat(allocationToAdd) <= 0}>Adicionar</Button>
                  </div>
                )}

                <div className={`mt-2 text-sm font-medium p-2 rounded-md ${Math.abs(totalAllocation - 100) > 0.01 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                  Total Alocado: {totalAllocation.toFixed(2)}%
                  {Math.abs(totalAllocation - 100) > 0.01 && selectedStocks.length > 0 && (
                    <span className="font-bold ml-2">(A soma deve ser 100%)</span>
                  )}
                </div>
                {allocationError && (
                  <p className="text-sm text-destructive mt-1">{allocationError}</p>
                )}
              </div>
            </div>

            {error && !loading && (
              <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="h-[400px] w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : chartData.length === 0 && !error ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Ajuste os parâmetros e as alocações (total 100%) para ver a simulação.
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-full w-full px-2 mx-auto">
                  <AreaChart data={chartData} margin={{ left: 30, right: 10, top: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--green))" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="hsl(var(--green))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--blue))" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="hsl(var(--blue))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(date) => date instanceof Date ? format(date, "MMM/yy", { locale: ptBR }) : ""}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `R$${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          labelFormatter={(_, payload) => payload?.[0]?.payload?.date instanceof Date ? format(payload[0].payload.date, "dd MMM yyyy", { locale: ptBR }) : ""}
                          formatter={(value, name) => [`R$${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, chartConfig[name as keyof typeof chartConfig]?.label || name]}
                        />
                      }
                    />
                    <Area type="monotone" dataKey="portfolioValue" stroke={chartConfig.portfolioValue.color} fillOpacity={1} fill="url(#colorPortfolio)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="contributions" stroke={chartConfig.contributions.color} fillOpacity={1} fill="url(#colorContributions)" strokeWidth={2}/>
                  </AreaChart>
                </ChartContainer>
              )}
            </div>

            {chartData.length > 0 && !loading && !error && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Investido</h3>
                  <p className="text-2xl font-bold">
                    R${Number(chartData[chartData.length - 1].contributions).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Valor Final do Portfólio</h3>
                  <p className="text-2xl font-bold">
                    R${Number(chartData[chartData.length - 1].portfolioValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Rentabilidade Total</h3>
                  <p className="text-2xl font-bold">
                    {chartData[chartData.length - 1].contributions > 0 ?
                      (((chartData[chartData.length - 1].portfolioValue / chartData[chartData.length - 1].contributions) - 1) * 100).toFixed(2) + '%'
                      : 'N/A'
                    }
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