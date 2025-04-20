"use client"

import { useState, useEffect, useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
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

interface CombinedChartDataPoint {
    date: Date;
    contributions: number;
    [key: string]: number | Date; // Stock tickers as keys for portfolio values
}

const STOCKS = [
    { value : "BBAS3", label : "Banco do Brasil (BBAS3)" },
    { value : "PETR4", label : "Petrobrás (PETR4)" },
    { value : "BBSE3", label : "BB Seguridade (BBSE3)" },
    { value : "ITSA4", label : "Itausa (ITSA4)" },
    { value : "VALE3", label : "Vale (VALE3)" },
    { value : "TAEE11", label : "Taesa (TAEE11)" },
    { value : "CMIG4", label : "Cemig (CMIG4)" },
    { value : "ISAE4", label : "Isa Energia Brasil (ISAE4)" },
    { value : "CXSE3", label : "Caixa Seguridade (CXSE3)" },
    { value : "CSMG3", label : "Copasa (CSMG3)" },
    { value : "GOAU4", label : "Gerdau Metalúrgica (GOAU4)" },
    { value : "WEGE3", label : "WEG (WEGE3)" },
    { value : "AURE3", label : "Auren Energia (AURE3)" },
    { value : "KLBN11", label : "Klabin (KLBN11)" },
    { value : "ITUB4", label : "Banco Itau Unibanco (ITUB4)" },
    { value : "EGIE3", label : "Engie Brasil (EGIE3)" },
]

const STOCK_COLORS = [
  "hsl(142.1 76.2% 36.3%)", // shadcn green
  "hsl(346.8 77.2% 49.8%)", // shadcn red
  "hsl(24.6 95% 53.1%)",   // shadcn orange
  "hsl(262.1 83.3% 57.8%)", // shadcn violet
  "hsl(198.6 81.8% 50.6%)", // A different blue/cyan
];
const CONTRIBUTION_COLOR = "hsl(221.2 83.2% 53.3%)"; // shadcn blue

export default function Simulator() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([STOCKS[0].value])
  const [initialContribution, setInitialContribution] = useState("1000")
  const [monthlyContribution, setMonthlyContribution] = useState("1000")
  const [startDate, setStartDate] = useState("2017-01")
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM"))
  const [processedChartData, setProcessedChartData] = useState<Record<string, ChartDataPoint[]>>({})
  const [combinedChartData, setCombinedChartData] = useState<CombinedChartDataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      contributions: {
        label: " Desembolso",
        color: CONTRIBUTION_COLOR,
      },
    };
    selectedStocks.forEach((stock, index) => {
      config[stock] = {
        label: STOCKS.find(s => s.value === stock)?.label || stock,
        color: STOCK_COLORS[index % STOCK_COLORS.length],
      };
    });
    return config;
  }, [selectedStocks]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStocks.length === 0) {
        setProcessedChartData({})
        setCombinedChartData([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const newProcessedData: Record<string, ChartDataPoint[]> = {};

      try {
        const [startYear, startMonth] = startDate.split('-')
        const [endYear, endMonth] = endDate.split('-')
        
        const start = startOfMonth(new Date(parseInt(startYear), parseInt(startMonth) - 1, 1, 12, 0, 0))
        const end = endOfMonth(new Date(parseInt(endYear), parseInt(endMonth) - 1, 1, 12, 0, 0))
        
        const results = await Promise.all(
          selectedStocks.map(stock =>
            fetch(
              `https://api.brmarketdata.com/prices/history?ticker=${stock}&start=${format(start, "yyyy-MM-dd")}&end=${format(end, "yyyy-MM-dd")}`,
              {
                mode: 'cors',
                headers: { 'Accept': 'application/json' },
              }
            ).then(res => {
              if (!res.ok) {
                throw new Error(`HTTP error for ${stock}! status: ${res.status}`);
              }
              return res.json();
            }).then(data => ({ stock, data }))
            .catch(err => ({ stock, error: err }))
          )
        );

        let fetchError: string | null = null;
        const allStockData: Record<string, any[]> = {};
        results.forEach(result => {
            if ('error' in result && result.error) {
                console.error(`Error fetching data for ${result.stock}:`, result.error);
                if (!fetchError) fetchError = result.error instanceof Error ? result.error.message : `Failed to fetch data for ${result.stock}`;
            } else if ('data' in result) {
                allStockData[result.stock] = result.data;
            }
        });

        if (fetchError) {
             setError(fetchError);
             setLoading(false);
             return;
        }

        selectedStocks.forEach(stock => {
          const stockData = allStockData[stock];
          if (!stockData) return;

          const startLimit = startOfMonth(new Date(parseInt(startYear), parseInt(startMonth) - 1, 1, 0, 0, 0));
          const endLimit = endOfMonth(new Date(parseInt(endYear), parseInt(endMonth) - 1, 1, 23, 59, 59));

          const sortedData = stockData.sort((a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          const filteredData = sortedData.filter((item: any) => {
            const itemDate = new Date(item.date);
            return itemDate >= startLimit && itemDate <= endLimit;
          });

          const monthlyData = filteredData.filter((item: any, index: number, array: any[]) => {
            if (index === 0) return true;
            const currentDate = new Date(item.date);
            const prevDate = new Date(array[index - 1].date);
            return currentDate.getMonth() !== prevDate.getMonth();
          });

          const processedStockData: ChartDataPoint[] = [];
          let shares = 0;
          let totalInvested = 0;
          let remainingMoney = 0;

          monthlyData.forEach((item: any, index: number) => {
            const date = new Date(item.date);
            const price = item.price;

            let availableMoney = remainingMoney;
            if (index === 0) {
              availableMoney += Number(initialContribution);
              totalInvested += Number(initialContribution);
            } else {
              availableMoney += Number(monthlyContribution);
              totalInvested += Number(monthlyContribution);
            }

            const sharesToBuy = Math.floor(availableMoney / price);
            const cost = sharesToBuy * price;
            remainingMoney = availableMoney - cost;
            shares += sharesToBuy;

            processedStockData.push({
              date,
              portfolioValue: shares * price,
              contributions: totalInvested,
              shares,
              price
            });
          });
          newProcessedData[stock] = processedStockData;
        });

        setProcessedChartData(newProcessedData);

        const allDates = new Set<number>();
        Object.values(newProcessedData).flat().forEach(dp => allDates.add(dp.date.getTime()));

        const sortedDates = Array.from(allDates).sort((a, b) => a - b).map(time => new Date(time));

        const finalCombinedData: CombinedChartDataPoint[] = [];
        const lastKnownValues: Record<string, number> = {};
        let lastKnownContribution = 0;

        sortedDates.forEach(date => {
          const point: CombinedChartDataPoint = { date, contributions: 0 };
          let contributionFound = false;

          selectedStocks.forEach(stock => {
            const stockData = newProcessedData[stock];
            if (stockData) {
                let dataPointForDate = null;
                for (let i = stockData.length - 1; i >= 0; i--) {
                    if (stockData[i].date <= date) {
                        dataPointForDate = stockData[i];
                        break;
                    }
                }

                if (dataPointForDate) {
                    point[stock] = dataPointForDate.portfolioValue;
                    lastKnownValues[stock] = dataPointForDate.portfolioValue;
                    if (!contributionFound) {
                        point.contributions = dataPointForDate.contributions;
                        lastKnownContribution = dataPointForDate.contributions;
                        contributionFound = true;
                    }
                } else {
                    point[stock] = lastKnownValues[stock] || 0;
                }
            } else {
                 point[stock] = lastKnownValues[stock] || 0;
            }
          });

           if (!contributionFound) {
             point.contributions = lastKnownContribution;
           }

          finalCombinedData.push(point);
        });

        setCombinedChartData(finalCombinedData);

      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedStocks, initialContribution, monthlyContribution, startDate, endDate])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Simulador de Aportes</h1>
            
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
                  <Label htmlFor="stock">Ação (Selecione até 5)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="lg" className="w-full justify-start">
                        <div className="flex gap-1 flex-wrap">
                          {selectedStocks.length === 0 && "Selecione as ações..."}
                          {selectedStocks.map((stockValue) => {
                             const stock = STOCKS.find(s => s.value === stockValue);
                             return (
                               <Badge
                                 key={stockValue}
                                 variant="secondary"
                                 className="rounded hover:bg-secondary/80"
                                 onClick={(e: React.MouseEvent) => {
                                     e.preventDefault();
                                     setSelectedStocks(prev => prev.filter(s => s !== stockValue));
                                 }}
                               >
                                 {stock ? stock.label : stockValue}
                                 <X className="ml-1 h-3 w-3" />
                               </Badge>
                             );
                          })}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                       <Command>
                          <CommandInput placeholder="Buscar ação..." />
                          <CommandList>
                             <CommandEmpty>Nenhuma ação encontrada.</CommandEmpty>
                             <CommandGroup>
                                {STOCKS.map((stock) => {
                                   const isSelected = selectedStocks.includes(stock.value);
                                   const isDisabled = !isSelected && selectedStocks.length >= 5;
                                   return (
                                      <CommandItem
                                         key={stock.value}
                                         value={stock.value}
                                         disabled={isDisabled}
                                         onSelect={() => {
                                            if (isSelected) {
                                               setSelectedStocks(prev => prev.filter(s => s !== stock.value));
                                            } else if (!isDisabled) {
                                               setSelectedStocks(prev => [...prev, stock.value]);
                                            }
                                         }}
                                         className={cn("flex items-center justify-between", isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}
                                      >
                                         <span>{stock.label}</span>
                                         {isSelected && <Check className="ml-2 h-4 w-4 text-primary" />}
                                      </CommandItem>
                                   );
                                })}
                             </CommandGroup>
                          </CommandList>
                       </Command>
                    </PopoverContent>
                  </Popover>
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
              ) : combinedChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-full w-full px-2 mx-auto">
                  <AreaChart data={combinedChartData} margin={{ left: 30, right: 10, top: 10, bottom: 5 }}>
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
                      tickFormatter={(value) => `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent 
                          labelFormatter={(_, payload) => {
                            if (!payload || payload.length === 0 || !payload[0]?.payload?.date) return "";
                            try {
                                const date = payload[0].payload.date;
                                return date instanceof Date && !isNaN(date.valueOf())
                                ? format(date, "PP", { locale: ptBR })
                                : "";
                            } catch (e) {
                                console.error("Error formatting date in tooltip:", e);
                                return "";
                            }
                          }}
                          formatter={(value, name, props) => {
                             const label = chartConfig[name as keyof typeof chartConfig]?.label ?? name;
                             const formattedValue = `R$${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} `;
                             return [formattedValue, label];
                          }}
                          itemSorter={(item) => {
                              if (item.dataKey === 'contributions') return -1;
                              const index = selectedStocks.indexOf(item.dataKey as string);
                              return index === -1 ? Infinity : index;
                          }}
                        />
                      } 
                    />
                    <Area
                      type="monotone"
                      dataKey="contributions"
                      stroke={CONTRIBUTION_COLOR}
                      fill={CONTRIBUTION_COLOR}
                      fillOpacity={0.1}
                      strokeWidth={2}
                      name={String(chartConfig.contributions.label ?? "Desembolso")}
                    />
                    {selectedStocks.map((stock, index) => (
                      <Area
                        key={stock}
                        type="monotone"
                        dataKey={stock}
                        stroke={STOCK_COLORS[index % STOCK_COLORS.length]}
                        fill={STOCK_COLORS[index % STOCK_COLORS.length]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                        name={String(chartConfig[stock]?.label ?? stock)}
                      />
                    ))}
                  </AreaChart>
                </ChartContainer>
              ) : (
                 <div className="flex items-center justify-center h-full text-muted-foreground">
                    {selectedStocks.length > 0 ? "Nenhum dado disponível para o período selecionado." : "Selecione uma ou mais ações para simular."}
                 </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 