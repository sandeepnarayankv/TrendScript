import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import apiService from '../services/api';
import { 
  ArrowLeft, 
  Wand2, 
  Copy, 
  Download, 
  Share2, 
  Clock, 
  Target, 
  Lightbulb,
  CheckCircle,
  Youtube,
  FileText,
  MessageSquare,
  Mic,
  Smartphone,
  AlertCircle,
  Loader2
} from 'lucide-react';

const ScriptGenerator = ({ trend, onBack }) => {
  const [contentTemplates, setContentTemplates] = useState([]);
  const [toneOptions, setToneOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Load templates and tone options on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      setError(null);

      const [templates, tones] = await Promise.all([
        apiService.getContentTemplates(),
        apiService.getToneOptions()
      ]);

      setContentTemplates(templates);
      setToneOptions(tones);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load configuration data. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const getTemplateIcon = (templateId) => {
    switch (templateId) {
      case 'youtube-explainer': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'blog-post': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'social-thread': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'podcast-guide': return <Mic className="w-5 h-5 text-purple-500" />;
      case 'short-form': return <Smartphone className="w-5 h-5 text-pink-500" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const generateContent = async () => {
    if (!selectedTemplate || !selectedTone) return;
    
    try {
      setIsGenerating(true);
      setProgress(0);
      setError(null);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 20;
        });
      }, 1000);

      const requestData = {
        trend_id: trend.id,
        template_id: selectedTemplate,
        tone: selectedTone,
        custom_prompt: customPrompt.trim() || null,
        session_id: `script_gen_${Date.now()}`
      };

      const response = await apiService.generateContent(requestData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setGeneratedContent(response.content);
        setIsGenerating(false);
      }, 500);

    } catch (err) {
      console.error('Error generating content:', err);
      setError(err.message || 'Failed to generate content. Please try again.');
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard');
    });
  };

  const selectedTemplateData = contentTemplates.find(t => t.id === selectedTemplate);
  const selectedToneData = toneOptions.find(t => t.id === selectedTone);

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
              Back to Trends
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading configuration...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !generatedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
              Back to Trends
            </Button>
          </div>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={loadInitialData} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (generatedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Trends
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{trend.topic}</h1>
              <p className="text-gray-600">Generated {selectedTemplateData?.name} Script</p>
            </div>
          </div>

          {/* Generated Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Script */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTemplateIcon(selectedTemplate)}
                      {generatedContent.title}
                    </CardTitle>
                    <CardDescription>
                      {selectedTemplateData?.estimatedLength} • {selectedToneData?.name} tone
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.title)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hook */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Opening Hook
                    </h3>
                    <p className="text-gray-700 italic">"{generatedContent.hook}"</p>
                  </div>

                  {/* Outline */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">Content Outline</h3>
                    <div className="space-y-4">
                      {generatedContent.outline?.map((section, index) => (
                        <Card key={index} className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800">{section.section}</h4>
                              <Badge variant="outline" className="text-xs">
                                {section.duration}
                              </Badge>
                            </div>
                            <ul className="space-y-1">
                              {section.content?.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Points to Cover</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedContent.keyPoints?.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{point}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* SEO & Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO & Hashtags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.seoKeywords?.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags?.map((hashtag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Prediction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estimated Views</span>
                    <span className="font-semibold text-green-600">{generatedContent.estimatedViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Difficulty</span>
                    <Badge variant="secondary">{generatedContent.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Content Score</span>
                    <span className="font-semibold text-purple-600">{trend.contentScore}/100</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Script
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  onClick={() => {
                    setGeneratedContent(null);
                    setSelectedTemplate('');
                    setSelectedTone('');
                    setCustomPrompt('');
                  }}
                >
                  Generate Another Version
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trends
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{trend.topic}</h1>
            <p className="text-gray-600">Generate AI-powered content script</p>
          </div>
        </div>

        {isGenerating ? (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Generating Your Content Script...
                </h3>
                <p className="text-gray-600">AI is analyzing trends and creating personalized content</p>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Template Selection */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Choose Content Template</CardTitle>
                  <CardDescription>
                    Select the format that best fits your content goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id 
                            ? 'ring-2 ring-purple-500 bg-purple-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{template.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{template.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                              <Badge variant="outline" className="text-xs">
                                {template.estimatedLength}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tone Selection */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Select Tone & Style</CardTitle>
                  <CardDescription>
                    Choose how you want your content to sound
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {toneOptions.map((tone) => (
                      <Button
                        key={tone.id}
                        variant={selectedTone === tone.id ? "default" : "outline"}
                        className={`h-auto p-3 flex flex-col items-center gap-2 ${
                          selectedTone === tone.id 
                            ? "bg-gradient-to-r from-purple-600 to-blue-600" 
                            : ""
                        }`}
                        onClick={() => setSelectedTone(tone.id)}
                      >
                        <span className="font-medium">{tone.name}</span>
                        <span className="text-xs text-center opacity-80">
                          {tone.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Instructions */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Additional Instructions (Optional)</CardTitle>
                  <CardDescription>
                    Add specific requirements or focus areas for your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., Focus on beginner-friendly explanations, include specific examples, mention competitors..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trend Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Content Score</span>
                    <span className="font-semibold text-purple-600">{trend.contentScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Velocity</span>
                    <Badge className="text-xs">{trend.trendVelocity}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Primary Platform</span>
                    <span className="text-sm font-medium capitalize">{trend.platform}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {trend.keyInsights?.map((insight, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <Lightbulb className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Error Display */}
              {error && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Generate Button */}
              <Button 
                onClick={generateContent}
                disabled={!selectedTemplate || !selectedTone || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-lg font-semibold disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Script
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptGenerator;