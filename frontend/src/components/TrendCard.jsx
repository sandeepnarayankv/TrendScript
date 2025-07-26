import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Zap, 
  Clock, 
  Target,
  Twitter,
  Youtube,
  MessageSquare,
  Music
} from 'lucide-react';

const TrendCard = ({ trend, onSelect }) => {
  const getVelocityIcon = (velocity) => {
    switch (velocity) {
      case 'Exploding': return <Zap className="w-4 h-4 text-red-500" />;
      case 'Rising Fast': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Steady Growth': return <Target className="w-4 h-4 text-blue-500" />;
      case 'Declining Slow': return <TrendingDown className="w-4 h-4 text-orange-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'reddit': return <MessageSquare className="w-4 h-4 text-orange-500" />;
      case 'tiktok': return <Music className="w-4 h-4 text-pink-500" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getVelocityColor = (velocity) => {
    switch (velocity) {
      case 'Exploding': return 'bg-red-100 text-red-700 border-red-200';
      case 'Rising Fast': return 'bg-green-100 text-green-700 border-green-200';
      case 'Steady Growth': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Declining Slow': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getPlatformIcon(trend.platform)}
            <span className="text-sm font-medium text-gray-600 capitalize">
              {trend.platform}
            </span>
            <span className="text-xs text-gray-400">{trend.timeframe}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(trend.contentScore)}`}>
            {trend.contentScore}/100
          </div>
        </div>
        
        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
          {trend.topic}
        </CardTitle>
        
        <div className="flex items-center gap-2">
          {getVelocityIcon(trend.trendVelocity)}
          <Badge className={`${getVelocityColor(trend.trendVelocity)} font-medium`}>
            {trend.trendVelocity}
          </Badge>
          <Badge variant="outline" className="text-gray-600">
            {trend.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Hashtags */}
        <div className="flex flex-wrap gap-2">
          {trend.hashtags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Twitter className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-blue-700">Twitter</span>
            </div>
            <p className="text-sm font-bold text-blue-800">
              {(trend.engagement.twitter.mentions / 1000).toFixed(1)}K mentions
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Youtube className="w-3 h-3 text-red-500" />
              <span className="text-xs font-medium text-red-700">YouTube</span>
            </div>
            <p className="text-sm font-bold text-red-800">
              {trend.engagement.youtube.videos} videos
            </p>
          </div>
        </div>

        {/* Key Insights Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Key Insights:</h4>
          <ul className="space-y-1">
            {trend.keyInsights.slice(0, 2).map((insight, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Potential Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Content Potential</span>
            <span className="text-sm font-bold text-purple-600">{trend.contentScore}%</span>
          </div>
          <Progress 
            value={trend.contentScore} 
            className="h-2 bg-gray-200"
          />
        </div>

        {/* Action Button */}
        <Button 
          onClick={onSelect}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Generate Content Script
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrendCard;