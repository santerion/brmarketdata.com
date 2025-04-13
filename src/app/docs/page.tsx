import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CodeBlock } from "@/components/CodeBlock"
import { DocsSidebar } from "@/components/DocsSidebar"

const docsSections = [
  {
    title: "Introdução",
    links: [
      {
        id: "getting-started",
        title: "Primeiros Passos",
        href: "#getting-started",
      },
    ],
  },
  {
    title: "API Endpoints",
    links: [
      {
        id: "prices",
        title: "Preços Históricos",
        href: "#prices",
      },
      {
        id: "indicators-history",
        title: "Histórico de Indicadores",
        href: "#indicators-history",
      },
      {
        id: "by-ticker",
        title: "Indicadores por Ticker",
        href: "#by-ticker",
      },
      {
        id: "by-indicator",
        title: "Ações por Indicador",
        href: "#by-indicator",
      },
    ],
  },
];

const pricesResponse = `{
  "ticker": "BBAS3",
  "prices": [
    {
      "date": "2010-01-04",
      "open": 26.45,
      "high": 26.89,
      "low": 26.12,
      "close": 26.62,
      "volume": 5782300
    }
    // Entradas adicionais de preços...
  ]
}`;

const indicatorHistoryResponse = `{
  "ticker": "BBAS3",
  "indicator": "p_l",
  "history": [
    {
      "date": "2020-01-01",
      "value": 8.45
    },
    {
      "date": "2020-02-01",
      "value": 8.76
    }
    // Entradas adicionais...
  ]
}`;

const byTickerResponse = `{
  "ticker": "BBAS3",
  "indicators": {
    "p_l": 8.92,
    "p_vp": 0.87,
    "dy": 5.23,
    "roe": 12.8
    // Indicadores adicionais...
  },
  "last_updated": "2023-09-15"
}`;

const byIndicatorResponse = `{
  "indicator": "p_l",
  "stocks": {
    "BBAS3": 8.92,
    "ITUB4": 9.45,
    "PETR4": 6.78,
    "VALE3": 5.23
    // Ações adicionais...
  },
  "last_updated": "2023-09-15"
}`;

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <DocsSidebar sections={docsSections} />
        <main className="flex-1 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Documentação da API</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Referência completa para a API BR Market Data
            </p>
            
            <div className="mb-12">
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

              <div className="space-y-12">
                <div id="prices">
                  <Card>
                    <CardHeader>
                      <CardTitle>Endpoint de Preços Históricos</CardTitle>
                      <p className="text-muted-foreground">Obtenha dados históricos de preços para uma ação específica</p>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                        GET /prices
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
                            <TableCell>Sim</TableCell>
                            <TableCell>Data inicial no formato AAAA-MM-DD</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-mono">end</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Sim</TableCell>
                            <TableCell>Data final no formato AAAA-MM-DD</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      
                      <h3 className="text-xl font-semibold mb-3">Exemplo de Requisição</h3>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                        https://api.brmarketdata.com/prices?ticker=BBAS3&start=2010-01-01&end=2026-01-01
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                      <CodeBlock code={pricesResponse} />
                    </CardContent>
                  </Card>
                </div>
                
                <div id="indicators-history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Endpoint de Histórico de Indicadores</CardTitle>
                      <p className="text-muted-foreground">Obtenha dados históricos para um indicador e ticker específicos</p>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                        GET /indicators/history
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
                            <TableCell className="font-mono">indicator</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Sim</TableCell>
                            <TableCell>Código do indicador financeiro (ex: p_l)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      
                      <h3 className="text-xl font-semibold mb-3">Exemplo de Requisição</h3>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                        https://api.brmarketdata.com/indicators/history?ticker=BBAS3&indicator=p_l
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                      <CodeBlock code={indicatorHistoryResponse} />
                    </CardContent>
                  </Card>
                </div>
                
                <div id="by-ticker">
                  <Card>
                    <CardHeader>
                      <CardTitle>Endpoint de Indicadores por Ticker</CardTitle>
                      <p className="text-muted-foreground">Obtenha todos os indicadores disponíveis para um ticker específico</p>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                        GET /indicators/by-ticker
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
                        https://api.brmarketdata.com/indicators/by-ticker?ticker=BBAS3
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                      <CodeBlock code={byTickerResponse} />
                    </CardContent>
                  </Card>
                </div>
                
                <div id="by-indicator">
                  <Card>
                    <CardHeader>
                      <CardTitle>Endpoint de Ações por Indicador</CardTitle>
                      <p className="text-muted-foreground">Obtenha o valor do indicador para todas as ações disponíveis</p>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-semibold mb-3">Endpoint</h3>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                        GET /indicators/by-indicator
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
                            <TableCell className="font-mono">indicator</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Sim</TableCell>
                            <TableCell>Código do indicador financeiro (ex: p_l)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      
                      <h3 className="text-xl font-semibold mb-3">Exemplo de Requisição</h3>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6">
                        https://api.brmarketdata.com/indicators/by-indicator?indicator=p_l
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3">Exemplo de Resposta</h3>
                      <CodeBlock code={byIndicatorResponse} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer/>
    </div>
  )
} 