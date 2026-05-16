import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Layers,
  ShoppingBag,
  Target,
  CheckCircle2
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Tabs, 
  TabsList, 
  TabsTrigger,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  cn 
} from '@sb/ui';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { formatCurrency } from '@sb/utils';

const spendData = [
  { month: 'Jan', spend: 45000, jobs: 12 },
  { month: 'Feb', spend: 52000, jobs: 15 },
  { month: 'Mar', spend: 48000, jobs: 14 },
  { month: 'Apr', spend: 61000, jobs: 18 },
  { month: 'May', spend: 55000, jobs: 16 },
  { month: 'Jun', spend: 67000, jobs: 20 },
];

const categoryData = [
  { name: 'Granite', value: 35 },
  { name: 'Quartz', value: 45 },
  { name: 'Marble', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Shop Intelligence</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 italic">
            Analyze your material spend, job efficiency, and supplier performance.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 px-4 font-black uppercase tracking-widest text-[10px] border-border/50 bg-card/50">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            Last 6 Months
            <ChevronDown className="ml-2 h-3 w-3" />
          </Button>
          <Button size="sm" className="h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg">
            <Download className="mr-2 h-3.5 w-3.5" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border/50 shadow-sm bg-primary text-white overflow-hidden relative">
          <div className="p-6 space-y-1 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Material Spend</p>
            <p className="text-3xl font-black tracking-tighter">{formatCurrency(328500)}</p>
            <div className="flex items-center gap-1.5 pt-2">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase">+12.5% vs prev period</span>
            </div>
          </div>
          <BarChart3 className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 rotate-12" />
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
          <CardContent className="p-6 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jobs Completed</p>
            <p className="text-3xl font-black tracking-tighter text-foreground">95</p>
            <div className="flex items-center gap-1.5 pt-2 text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase">98.2% on schedule</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
          <CardContent className="p-6 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg Slab Yield</p>
            <p className="text-3xl font-black tracking-tighter text-foreground">84.5%</p>
            <div className="flex items-center gap-1.5 pt-2 text-amber-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase">+2.1% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
          <CardContent className="p-6 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Suppliers</p>
            <p className="text-3xl font-black tracking-tighter text-foreground">12</p>
            <div className="flex items-center gap-1.5 pt-2 text-primary">
              <Target className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase">4 preferred partners</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Spend Trend Chart */}
        <Card className="lg:col-span-8 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Material Spend & Volume</CardTitle>
              <p className="text-xs text-muted-foreground font-medium italic">Monthly investment in stone and products</p>
            </div>
            <Tabs defaultValue="spend" className="w-auto">
              <TabsList className="h-9 p-1 rounded-lg">
                <TabsTrigger value="spend" className="text-[10px] font-black uppercase px-4 h-7 rounded-md">Spend</TabsTrigger>
                <TabsTrigger value="volume" className="text-[10px] font-black uppercase px-4 h-7 rounded-md">Jobs</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }}
                    tickFormatter={(v) => `$${v/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '12px' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="lg:col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Material Mix</CardTitle>
            <p className="text-xs text-muted-foreground font-medium italic">Spending by stone category</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {categoryData.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold text-foreground/80">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
