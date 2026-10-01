export type MockAccount = {
  id: string;
  name: string;
  initials: string;
  bank: string;
  color: string;
  balance: number;
};
export type MockTransaction = {
  id: string;
  accountId: string;
  description: string;
  category: string;
  date: string;
  amount: number;
};
export type MockAsset = {
  id: string;
  ticker: string;
  name: string;
  category: 'Ações' | 'Renda fixa' | 'FIIs' | 'Cripto';
  color: string;
  invested: number;
  currentValue: number;
  dailyChange: number;
  monthChange: number;
};

export const accounts: MockAccount[] = [
  {
    id: 'joao-nu',
    name: 'João — Nubank',
    initials: 'JN',
    bank: 'Nubank',
    color: '#A78BFA',
    balance: 3240,
  },
  {
    id: 'joao-it',
    name: 'João — Itaú',
    initials: 'JI',
    bank: 'Itaú',
    color: '#F97316',
    balance: 12850,
  },
  {
    id: 'ana-nu',
    name: 'Ana — Nubank',
    initials: 'AN',
    bank: 'Nubank',
    color: '#F472B6',
    balance: 5620,
  },
  {
    id: 'ana-brad',
    name: 'Ana — Bradesco',
    initials: 'AB',
    bank: 'Bradesco',
    color: '#EF4444',
    balance: 2180,
  },
  {
    id: 'pedro-bb',
    name: 'Pedro — BB',
    initials: 'PB',
    bank: 'Banco do Brasil',
    color: '#F59E0B',
    balance: 8970,
  },
];
export const accountGroups = [
  { label: 'Pessoal — Nubank', type: 'Conta pessoal', ids: ['joao-nu'] },
  { label: 'Todas as minhas contas', type: 'Minhas contas', ids: ['joao-nu', 'joao-it'] },
  { label: 'Família Mendes', type: 'Conta familiar', ids: accounts.map((account) => account.id) },
];
export const accountPeriod = {
  'joao-nu': { inflows: 3500, outflows: 260 },
  'joao-it': { inflows: 6456, outflows: 516 },
  'ana-nu': { inflows: 4200, outflows: 380 },
  'ana-brad': { inflows: 1800, outflows: 220 },
  'pedro-bb': { inflows: 7200, outflows: 630 },
} as const;
export const transactions: MockTransaction[] = [
  {
    id: '1',
    accountId: 'joao-nu',
    description: 'Salário',
    category: 'Receita',
    date: '25 Jul',
    amount: 8500,
  },
  {
    id: '2',
    accountId: 'joao-it',
    description: 'Supermercado Pão de Açúcar',
    category: 'Alimentação',
    date: '24 Jul',
    amount: -342.9,
  },
  {
    id: '3',
    accountId: 'joao-nu',
    description: 'Netflix',
    category: 'Streaming',
    date: '23 Jul',
    amount: -55.9,
  },
  {
    id: '4',
    accountId: 'joao-it',
    description: 'Transferência recebida',
    category: 'Pix',
    date: '22 Jul',
    amount: 1200,
  },
  {
    id: '5',
    accountId: 'ana-nu',
    description: 'Farmácia',
    category: 'Saúde',
    date: '21 Jul',
    amount: -89.5,
  },
  {
    id: '6',
    accountId: 'joao-nu',
    description: 'Uber',
    category: 'Transporte',
    date: '20 Jul',
    amount: -32.4,
  },
  {
    id: '7',
    accountId: 'joao-it',
    description: 'Rendimento CDB',
    category: 'Investimento',
    date: '19 Jul',
    amount: 214.8,
  },
  {
    id: '8',
    accountId: 'ana-brad',
    description: 'Conta de luz ENEL',
    category: 'Utilidades',
    date: '18 Jul',
    amount: -187.3,
  },
  {
    id: '9',
    accountId: 'pedro-bb',
    description: 'iFood',
    category: 'Alimentação',
    date: '17 Jul',
    amount: -68.9,
  },
  {
    id: '10',
    accountId: 'pedro-bb',
    description: 'Salário Pedro',
    category: 'Receita',
    date: '16 Jul',
    amount: 7200,
  },
  {
    id: '12',
    accountId: 'joao-nu',
    description: 'Cashback Nubank',
    category: 'Benefício',
    date: '14 Jul',
    amount: 42,
  },
];
export const assets: MockAsset[] = [
  {
    id: 'petr4',
    ticker: 'PETR4',
    name: 'Petrobras PN',
    category: 'Ações',
    color: '#6366F1',
    invested: 8200,
    currentValue: 9840,
    dailyChange: 1.24,
    monthChange: 5.8,
  },
  {
    id: 'vale3',
    ticker: 'VALE3',
    name: 'Vale ON',
    category: 'Ações',
    color: '#F59E0B',
    invested: 10500,
    currentValue: 11380,
    dailyChange: -0.67,
    monthChange: 2.1,
  },
  {
    id: 'itub4',
    ticker: 'ITUB4',
    name: 'Itaú Unibanco',
    category: 'Ações',
    color: '#06B6D4',
    invested: 6800,
    currentValue: 7120,
    dailyChange: 0.35,
    monthChange: 1.4,
  },
  {
    id: 'cdb',
    ticker: 'CDB',
    name: 'CDB Nubank 112% CDI',
    category: 'Renda fixa',
    color: '#A78BFA',
    invested: 15000,
    currentValue: 15840,
    dailyChange: 0.05,
    monthChange: 1.12,
  },
  {
    id: 'ipca',
    ticker: 'IPCA+',
    name: 'Tesouro IPCA+ 2029',
    category: 'Renda fixa',
    color: '#34D399',
    invested: 12000,
    currentValue: 12960,
    dailyChange: 0.02,
    monthChange: 0.87,
  },
  {
    id: 'lci',
    ticker: 'LCI',
    name: 'LCI Itaú 95% CDI',
    category: 'Renda fixa',
    color: '#FB923C',
    invested: 8000,
    currentValue: 8290,
    dailyChange: 0.04,
    monthChange: 0.9,
  },
  {
    id: 'mxrf11',
    ticker: 'MXRF11',
    name: 'Maxi Renda FII',
    category: 'FIIs',
    color: '#F472B6',
    invested: 6400,
    currentValue: 7080,
    dailyChange: 0.18,
    monthChange: 3.2,
  },
  {
    id: 'hglg11',
    ticker: 'HGLG11',
    name: 'CSHG Logística FII',
    category: 'FIIs',
    color: '#22D3EE',
    invested: 7200,
    currentValue: 7560,
    dailyChange: -0.22,
    monthChange: 1.8,
  },
  {
    id: 'btc',
    ticker: 'BTC',
    name: 'Bitcoin',
    category: 'Cripto',
    color: '#F97316',
    invested: 5000,
    currentValue: 5960,
    dailyChange: 2.84,
    monthChange: 8.4,
  },
  {
    id: 'eth',
    ticker: 'ETH',
    name: 'Ethereum',
    category: 'Cripto',
    color: '#818CF8',
    invested: 2800,
    currentValue: 2400,
    dailyChange: -1.9,
    monthChange: -4.2,
  },
];
export const monthlyHistory = [6400, 5800, 7200, 6900, 8100, 7500, 9200];
export const monthlyCashflow = [
  { label: 'Jan', credits: 6400, debits: 4200 },
  { label: 'Fev', credits: 5800, debits: 3900 },
  { label: 'Mar', credits: 7200, debits: 5100 },
  { label: 'Abr', credits: 6900, debits: 4600 },
  { label: 'Mai', credits: 8100, debits: 5800 },
  { label: 'Jun', credits: 7500, debits: 4300 },
  { label: 'Jul', credits: 9200, debits: 6100 },
] as const;
export const weeklyCashflow = [
  { label: 'Seg', credits: 320, debits: 180 },
  { label: 'Ter', credits: 0, debits: 450 },
  { label: 'Qua', credits: 1200, debits: 230 },
  { label: 'Qui', credits: 80, debits: 670 },
  { label: 'Sex', credits: 2400, debits: 120 },
  { label: 'Sáb', credits: 0, debits: 890 },
  { label: 'Dom', credits: 500, debits: 60 },
] as const;
export const portfolioHistory = [74200, 77800, 75400, 80100, 84600, 87430];
