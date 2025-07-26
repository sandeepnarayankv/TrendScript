import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import TrendCard from './TrendCard';
import apiService from '../services/api';
import { Search, Filter, TrendingUp, Zap, Clock, Target, AlertCircle } from 'lucide-react';

const TrendDashboard = ({ onTrendSelect }) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('contentScore');
  const [stats, setStats] = useState({
    totalTrends: 0,
    highPotential: 0,
    averageScore: 0,
    platforms: 4
  });

  // Load initial data
  useEffect(() => {
    loadTrends();
    loadStats();
  }, []);

  // Filter trends when search or filters change
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadTrends();
    }, 500); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedCategory, selectedPlatform]);

  const loadTrends = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        limit: 20,
        page: 1
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (selectedPlatform !== 'all') {
        params.platform = selectedPlatform;
      }

      const data = await apiService.getTrendingTopics(params);
      
      let trendsList = data.trends || [];
      
      // Client-side sorting
      if (sortBy === 'contentScore') {
        trendsList.sort((a, b) => b.contentScore - a.contentScore);
      } else if (sortBy === 'timeframe') {
        trendsList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      setTrends(trendsList);
    } catch (err) {
      console.error('Error loading trends:', err);
      setError('Failed to load trends. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await apiService.getPlatformStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
      // Keep default stats if API fails
    }
  };

  const getVelocityIcon = (velocity) => {
    switch (velocity) {
      case 'Exploding': return <Zap className="w-4 h-4 text-red-500" />;
      case 'Rising Fast': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Steady Growth': return <Target className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
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
                  <p className="text-3xl font-bold">{stats.platforms}</p>
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
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
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
              {loading ? 'Loading...' : `Trending Now (${trends.length})`}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Updated 2 minutes ago
            </div>
          </div>
          
          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-800">Error Loading Trends</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                  <Button 
                    onClick={loadTrends}
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          ) : trends.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Trends Found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== 'all' || selectedPlatform !== 'all'
                    ? 'Try adjusting your search criteria or filters.'
                    : 'No trending topics available at the moment.'}
                </p>
                {(searchTerm || selectedCategory !== 'all' || selectedPlatform !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedPlatform('all');
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trends.map((trend) => (
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