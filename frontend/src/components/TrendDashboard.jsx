import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockTrends } from '../data/mockData';
import TrendCard from './TrendCard';
import { Search, Filter, TrendingUp, Zap, Clock, Target } from 'lucide-react';

const TrendDashboard = ({ onTrendSelect }) => {
  const [trends, setTrends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('contentScore');

  useEffect(() => {
    // Simulate loading trends
    setTimeout(() => {
      setTrends(mockTrends);
    }, 1000);
  }, []);

  const filteredTrends = trends.filter(trend => {
    const matchesSearch = trend.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trend.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || trend.category.toLowerCase() === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || trend.platform === selectedPlatform;
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const sortedTrends = [...filteredTrends].sort((a, b) => {
    if (sortBy === 'contentScore') return b.contentScore - a.contentScore;
    if (sortBy === 'timeframe') return new Date(b.timeframe) - new Date(a.timeframe);
    return 0;
  });

  const getVelocityIcon = (velocity) => {
    switch (velocity) {
      case 'Exploding': return <Zap className="w-4 h-4 text-red-500" />;
      case 'Rising Fast': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Steady Growth': return <Target className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const stats = {
    totalTrends: trends.length,
    highPotential: trends.filter(t => t.contentScore >= 85).length,
    averageScore: trends.length ? Math.round(trends.reduce((sum, t) => sum + t.contentScore, 0) / trends.length) : 0,
    platforms: ['twitter', 'youtube', 'reddit', 'tiktok']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold">TrendScript AI</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover trending topics and generate AI-powered content scripts in minutes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Trends</p>
                  <p className="text-3xl font-bold">{stats.totalTrends}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">High Potential</p>
                  <p className="text-3xl font-bold">{stats.highPotential}</p>
                </div>
                <Zap className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Avg Score</p>
                  <p className="text-3xl font-bold">{stats.averageScore}</p>
                </div>
                <Target className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Platforms</p>
                  <p className="text-3xl font-bold">{stats.platforms.length}</p>
                </div>
                <Filter className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Search Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search trends, hashtags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-purple-500 transition-colors"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contentScore">Content Score</SelectItem>
                  <SelectItem value="timeframe">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trends Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Trending Now ({sortedTrends.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Updated 2 minutes ago
            </div>
          </div>
          
          {trends.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedTrends.map((trend) => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                  onSelect={() => onTrendSelect(trend)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendDashboard;