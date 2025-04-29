"use client"

import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CodeBlock } from "@/components/CodeBlock"
import { DocsSidebar } from "@/components/DocsSidebar"
import { useState } from "react"

const docsSections = [
  {
    title: "Introdução",
    links: [
      {
        id: "getting-started",
        title: "Primeiros Passos",
        href: "#getting-started",
      },
      {
        id: "available-indicators",
        title: "Indicadores Disponíveis",
        href: "#available-indicators",
      },
    ],
  },
  {
    title: "API Endpoints",
    links: [
      {
        id: "prices-history",
        title: "Histórico de Preços",
        href: "#prices-history",
      },
      {
        id: "prices-by-date",
        title: "Preços por Data",
        href: "#prices-by-date",
      },
      {
        id: "fundamentals-history",
        title: "Histórico de Indicadores",
        href: "#fundamentals-history",
      },
      {
        id: "fundamentals-by-ticker",
        title: "Indicadores por Ticker",
        href: "#fundamentals-by-ticker",
      },
      {
        id: "fundamentals-by-fundamental",
        title: "Indicadores por Indicador",
        href: "#fundamentals-by-fundamental",
      },
    ],
  },
];

const pricesHistoryResponse = `[
  {
    "ticker": "BBAS3",
    "price": 7.33,
    "date": "2015-04-30",
    "currency": "BRL"
  },
  {
    "ticker": "BBAS3",
    "price": 7.28,
    "date": "2015-05-04",
    "currency": "BRL"
  },
  ... (continua)
]`;

const pricesByDateResponse = `[
  {
    "ticker": "VALE3",
    "price": 59.94,
    "date": "2024-06-30",
    "currency": "BRL"
  },
  {
    "ticker": "LREN3",
    "price": 11.13,
    "date": "2024-06-30",
    "currency": "BRL"
  },
  {
    "ticker": "KLBN11",
    "price": 20.67,
    "date": "2024-06-30",
    "currency": "BRL"
  },
  ... (continua)
]`;

const fundamentalHistoryResponse = `[
  {
    "ticker": "BBAS3",
    "date": "2010-12-31",
    "key": "p_l",
    "name": "P/L",
    "value": 7.946
  },
  {
    "ticker": "BBAS3",
    "date": "2011-12-31",
    "key": "p_l",
    "name": "P/L",
    "value": 5.1842
  },
  ... (continua)
]`;

const byTickerResponse = `[
  {
    "ticker": "KLBN11",
    "date": "2025-04-29",
    "key": "dy12m",
    "name": "DIVIDEND YIELD (DY)",
    "value": 6.6
  },
  {
    "ticker": "KLBN11",
    "date": "2025-04-29",
    "key": "evEbit",
    "name": "EV/EBIT",
    "value": 12.36
  },
  {
    "ticker": "KLBN11",
    "date": "2025-04-29",
    "key": "roic",
    "name": "ROIC",
    "value": 9.22
  },
  ... (continua)
]`;

const byFundamentalResponse = `[
  {
    "ticker": "BBAS3",
    "date": "2025-04-29",
    "key": "p_l",
    "name": "P/L",
    "value": 6.23
  },
  {
    "ticker": "BBDC3",
    "date": "2025-04-29",
    "key": "p_l",
    "name": "P/L",
    "value": 7.47
  },
  ... (continua)
]`;

export default function DocsPage() {
  const [isListOpen, setIsListOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row relative">
        <DocsSidebar sections={docsSections} />
        <main className="flex-1 py-12 px-4 md:px-6 pt-20 lg:pt-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentação da API</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Referência completa para a API BR Market Data
            </p>
            
            <div className="mb-12 space-y-8">
              <div id="getting-started">
                <h2 className="text-3xl font-bold mb-6">Primeiros Passos</h2>
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <p className="mb-4">
                      A API BR Market Data fornece acesso a dados do mercado de ações brasileiro e indicadores financeiros.
                      Todas as requisições da API devem ser enviadas para a URL base:
                    </p>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
                      https://api.brmarketdata.com
                    </div>
                    <p>Todos os endpoints retornam dados no formato JSON. Não é necessária autenticação no momento.</p>
                  </CardContent>
                </Card>
              </div>
              
              <div id="available-indicators">
                <h2 className="text-3xl font-bold mb-6">Indicadores Disponíveis</h2>
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <p className="mb-4">
                      A API disponibiliza diversos indicadores fundamentalistas. Você pode utilizar os códigos abaixo nos endpoints de indicadores.
                    </p>
                    
                    <div className="w-full">
                      <button 
                        onClick={() => setIsListOpen(!isListOpen)}
                        className="flex items-center justify-between w-full p-4 font-medium text-left bg-muted rounded-md hover:bg-muted/80"
                      >
                        <span>Indicadores disponíveis para busca</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`h-5 w-5 transition-transform duration-200 ${isListOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                      
                      {isListOpen && (
                        <div className="mt-2 space-y-2 p-4 bg-muted rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="font-mono text-sm">cagrLucros5anos</div>
                            <div className="font-mono text-sm">cagrReceitas5anos</div>
                            <div className="font-mono text-sm">dividaBrutaPatrimonio</div>
                            <div className="font-mono text-sm">dividaLiquida_ebit</div>
                            <div className="font-mono text-sm">dividaLiquida_ebitda</div>
                            <div className="font-mono text-sm">dy12m</div>
                            <div className="font-mono text-sm">evEbit</div>
                            <div className="font-mono text-sm">evEbitda</div>
                            <div className="font-mono text-sm">giroAtivos</div>
                            <div className="font-mono text-sm">liquidezCorrente</div>
                            <div className="font-mono text-sm">lpa</div>
                            <div className="font-mono text-sm">margemBruta</div>
                            <div className="font-mono text-sm">margemEbit</div>
                            <div className="font-mono text-sm">margemEbitda</div>
                            <div className="font-mono text-sm">margemLiquida</div>
                            <div className="font-mono text-sm">passivos_ativos</div>
                            <div className="font-mono text-sm">p_ativoCircLiq</div>
                            <div className="font-mono text-sm">p_ativos</div>
                            <div className="font-mono text-sm">patrimonio_ativos</div>
                            <div className="font-mono text-sm">payout</div>
                            <div className="font-mono text-sm">p_capitalGiro</div>
                            <div className="font-mono text-sm">p_ebit</div>
                            <div className="font-mono text-sm">p_ebitda</div>
                            <div className="font-mono text-sm">p_l</div>
                            <div className="font-mono text-sm">psr</div>
                            <div className="font-mono text-sm">p_vp</div>
                            <div className="font-mono text-sm">roa</div>
                            <div className="font-mono text-sm">roe</div>
                            <div className="font-mono text-sm">roic</div>
                            <div className="font-mono text-sm">vpa</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="prices-history">
                <Card>
                  <CardHeader>
                    <CardTitle>Endpoint de Histórico de Preços</CardTitle>
                    <p className="text-muted-foreground">Obtenha o histórico de preços para uma ação específica</p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      GET /precos/historico
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Parâmetros</h3>
                    <Table className="mb-6">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parâmetro</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Obrigatório</TableHead>
                          <TableHead>Descrição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-mono">ticker</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Sim</TableCell>
                          <TableCell>Código da ação (ex: BBAS3)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono">start</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Não</TableCell>
                          <TableCell>Data inicial no formato AAAA-MM-DD</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono">end</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Não</TableCell>
                          <TableCell>Data final no formato AAAA-MM-DD</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono">sort</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Não</TableCell>
                          <TableCell>Ordenar por data: "asc" ou "desc"</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono">currency</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Não</TableCell>
                          <TableCell>Moeda: "BRL", "USD" ou "EUR"</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Requisição</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      https://api.brmarketdata.com/precos/historico?ticker=BBAS3&start=2015-04-30&end=2026-01-01
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                    <CodeBlock code={pricesHistoryResponse} />
                  </CardContent>
                </Card>
              </div>
              
              <div id="prices-by-date">
                <Card>
                  <CardHeader>
                    <CardTitle>Endpoint de Preços por Data</CardTitle>
                    <p className="text-muted-foreground">Obtenha preços de todas as ações disponíveis em uma determinada data.
                    <br/>
                    Se não for informada uma data, será retornado o preço mais recente disponível.</p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      GET /precos/por-data
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Parâmetros</h3>
                    <Table className="mb-6">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parâmetro</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Obrigatório</TableHead>
                          <TableHead>Descrição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-mono">date</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Não</TableCell>
                          <TableCell>Data no formato AAAA-MM-DD</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono">currency</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Não</TableCell>
                          <TableCell>Moeda: "BRL", "USD" ou "EUR"</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Requisição</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      https://api.brmarketdata.com/precos/por-data?date=2024-06-30
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                    <CodeBlock code={pricesByDateResponse} />
                  </CardContent>
                </Card>
              </div>
              
              <div id="fundamentals-history">
                <Card>
                  <CardHeader>
                    <CardTitle>Endpoint de Histórico de Indicadores</CardTitle>
                    <p className="text-muted-foreground">Obtenha dados históricos para um indicador e ticker específicos</p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      GET /indicadores/historico
                    </div>


                    
                    <h3 className="text-xl font-semibold mb-3">Parâmetros</h3>
                    <Table className="mb-6">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parâmetro</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Obrigatório</TableHead>
                          <TableHead>Descrição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-mono">ticker</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Sim</TableCell>
                          <TableCell>Código da ação (ex: BBAS3)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono">indicador</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Sim</TableCell>
                          <TableCell>Código do indicador financeiro (ex: p_l)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono">sort</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Não</TableCell>
                          <TableCell>Ordenar por data: "asc" ou "desc"</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Requisição</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      https://api.brmarketdata.com/indicadores/historico?ticker=BBAS3&indicador=p_l
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                    <CodeBlock code={fundamentalHistoryResponse} />
                  </CardContent>
                </Card>
              </div>
              
              <div id="fundamentals-by-ticker">
                <Card>
                  <CardHeader>
                    <CardTitle>Endpoint de Indicadores por Ticker</CardTitle>
                    <p className="text-muted-foreground">Obtenha todos os indicadores disponíveis para um ticker específico</p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      GET /indicadores/por-ticker
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Parâmetros</h3>
                    <Table className="mb-6">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parâmetro</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Obrigatório</TableHead>
                          <TableHead>Descrição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-mono">ticker</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Sim</TableCell>
                          <TableCell>Código da ação (ex: BBAS3)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Requisição</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      https://api.brmarketdata.com/indicadores/por-ticker?ticker=BBAS3
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                    <CodeBlock code={byTickerResponse} />
                  </CardContent>
                </Card>
              </div>
              
              <div id="fundamentals-by-fundamental">
                <Card>
                  <CardHeader>
                    <CardTitle>Endpoint de Ações por Indicador</CardTitle>
                    <p className="text-muted-foreground">Obtenha o valor do indicador para todas as ações disponíveis</p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      GET /indicadores/por-indicador
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Parâmetros</h3>
                    <Table className="mb-6">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parâmetro</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Obrigatório</TableHead>
                          <TableHead>Descrição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-mono">indicador</TableCell>
                          <TableCell>string</TableCell>
                          <TableCell>Sim</TableCell>
                          <TableCell>Código do indicador financeiro (ex: p_l)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Requisição</h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                      https://api.brmarketdata.com/indicadores/por-indicador?indicador=p_l
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                    <CodeBlock code={byFundamentalResponse} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer/>
    </div>
  )
} 