// Mock data for TrendScript AI
export const mockTrends = [
  {
    id: 1,
    topic: "AI-Powered Code Reviews",
    platform: "twitter",
    hashtags: ["#AI", "#CodeReview", "#DevTools"],
    contentScore: 87,
    trendVelocity: "Rising Fast",
    engagement: {
      twitter: { posts: 12500, mentions: 45000, sentiment: 0.8 },
      youtube: { videos: 234, totalViews: 890000, avgViews: 3800 },
      reddit: { posts: 89, upvotes: 15600, comments: 2400 },
      tiktok: { videos: 156, totalViews: 456000, engagement: 0.12 }
    },
    keyInsights: [
      "Developers are discussing automated code review tools",
      "Focus on productivity and code quality improvements",
      "High interest in AI integration with existing workflows"
    ],
    suggestedAngles: [
      "How AI code reviews save 3+ hours daily",
      "Comparing top AI code review tools in 2025",
      "Building your own AI code reviewer"
    ],
    timeframe: "2h ago",
    category: "Technology"
  },
  {
    id: 2,
    topic: "Micro-SaaS Success Stories",
    platform: "youtube",
    hashtags: ["#MicroSaaS", "#Entrepreneurship", "#SideHustle"],
    contentScore: 92,
    trendVelocity: "Steady Growth",
    engagement: {
      twitter: { posts: 8900, mentions: 34000, sentiment: 0.85 },
      youtube: { videos: 567, totalViews: 2300000, avgViews: 4100 },
      reddit: { posts: 156, upvotes: 28900, comments: 4500 },
      tiktok: { videos: 89, totalViews: 234000, engagement: 0.09 }
    },
    keyInsights: [
      "Solo founders sharing revenue milestones",
      "Focus on simple, profitable business models",
      "High engagement on success story content"
    ],
    suggestedAngles: [
      "From $0 to $10k MRR: Micro-SaaS breakdown",
      "5 Micro-SaaS ideas you can build this weekend",
      "Why Micro-SaaS beats venture-backed startups"
    ],
    timeframe: "4h ago",
    category: "Business"
  },
  {
    id: 3,
    topic: "Remote Work Productivity Hacks",
    platform: "reddit",
    hashtags: ["#RemoteWork", "#Productivity", "#WorkFromHome"],
    contentScore: 78,
    trendVelocity: "Declining Slow",
    engagement: {
      twitter: { posts: 15600, mentions: 56000, sentiment: 0.7 },
      youtube: { videos: 890, totalViews: 1800000, avgViews: 2000 },
      reddit: { posts: 234, upvotes: 45600, comments: 6700 },
      tiktok: { videos: 456, totalViews: 890000, engagement: 0.15 }
    },
    keyInsights: [
      "Focus on mental health and work-life balance",
      "Tools and techniques for staying focused",
      "Common challenges and practical solutions"
    ],
    suggestedAngles: [
      "The 4-hour productivity system for remote workers",
      "Remote work tools that actually work",
      "Fixing remote work burnout in 30 days"
    ],
    timeframe: "6h ago",
    category: "Lifestyle"
  },
  {
    id: 4,
    topic: "AI Image Generation Ethics",
    platform: "tiktok",
    hashtags: ["#AIEthics", "#DigitalArt", "#CreativeRights"],
    contentScore: 95,
    trendVelocity: "Exploding",
    engagement: {
      twitter: { posts: 23400, mentions: 78000, sentiment: 0.6 },
      youtube: { videos: 123, totalViews: 567000, avgViews: 4600 },
      reddit: { posts: 345, upvotes: 67800, comments: 12400 },
      tiktok: { videos: 1200, totalViews: 3400000, engagement: 0.18 }
    },
    keyInsights: [
      "Debate around AI art and original creativity",
      "Copyright concerns and artist compensation",
      "Generational divide on AI art acceptance"
    ],
    suggestedAngles: [
      "Why AI art is killing creativity (or not)",
      "The legal battle over AI-generated images",
      "Artists vs AI: Finding the middle ground"
    ],
    timeframe: "1h ago",
    category: "Technology"
  }
];

export const contentTemplates = [
  {
    id: "youtube-explainer",
    name: "YouTube Explainer",
    description: "10-15 minute deep dive video",
    structure: ["Hook", "Problem Setup", "Main Content", "Examples", "Call to Action"],
    estimatedLength: "12-15 minutes",
    icon: "📺"
  },
  {
    id: "blog-post",
    name: "Blog Post Deep Dive",
    description: "Comprehensive written analysis",
    structure: ["Compelling Headline", "Introduction", "Main Points", "Case Studies", "Conclusion"],
    estimatedLength: "1500-2000 words",
    icon: "📝"
  },
  {
    id: "social-thread",
    name: "Social Media Thread",
    description: "Twitter/LinkedIn thread format",
    structure: ["Hook Tweet", "Problem Statement", "Key Points", "Examples", "CTA"],
    estimatedLength: "8-12 tweets",
    icon: "🧵"
  },
  {
    id: "podcast-guide",
    name: "Podcast Discussion Guide",
    description: "Structured talking points",
    structure: ["Opening Hook", "Key Discussion Points", "Questions", "Takeaways"],
    estimatedLength: "20-30 minutes",
    icon: "🎙️"
  },
  {
    id: "short-form",
    name: "Short-Form Video",
    description: "TikTok/Instagram Reels",
    structure: ["Attention Grabber", "Quick Value", "Visual Hook", "CTA"],
    estimatedLength: "30-60 seconds",
    icon: "📱"
  }
];

export const toneOptions = [
  { id: "professional", name: "Professional", description: "Authoritative and business-focused" },
  { id: "casual", name: "Casual", description: "Friendly and conversational" },
  { id: "humorous", name: "Humorous", description: "Light-hearted with jokes and wit" },
  { id: "educational", name: "Educational", description: "Teaching-focused and informative" },
  { id: "controversial", name: "Controversial", description: "Provocative and debate-inducing" },
  { id: "inspirational", name: "Inspirational", description: "Motivational and uplifting" }
];

export const mockGeneratedContent = {
  title: "AI Code Reviews: The Developer Productivity Game-Changer of 2025",
  hook: "What if I told you that AI could review your code better than your senior developer... and it never gets tired, never judges, and works 24/7?",
  outline: [
    {
      section: "Hook & Problem Setup",
      duration: "0:00 - 1:30",
      content: [
        "Start with shocking statistic: 'Developers spend 23% of their time on code reviews'",
        "Personal story: 'I used to dread code review comments...'",
        "Promise: 'Today I'll show you how AI eliminated 3+ hours of review time daily'"
      ]
    },
    {
      section: "The Current Code Review Problem",
      duration: "1:30 - 3:00",
      content: [
        "Bottlenecks in development teams",
        "Human bias and inconsistency",
        "Time-consuming back-and-forth discussions",
        "Show examples of typical review comments"
      ]
    },
    {
      section: "AI Code Review Revolution",
      duration: "3:00 - 7:00",
      content: [
        "How AI analyzes code patterns",
        "Demo of AI reviewing actual code",
        "Comparison: Human vs AI review speed",
        "Real metrics from development teams"
      ]
    },
    {
      section: "Top AI Code Review Tools",
      duration: "7:00 - 11:00",
      content: [
        "CodeRabbit: Best for team collaboration",
        "Amazon CodeGuru: For AWS environments",
        "DeepCode: Security-focused reviews",
        "Pricing and feature comparison"
      ]
    },
    {
      section: "Implementation & Results",
      duration: "11:00 - 13:30",
      content: [
        "Step-by-step setup guide",
        "Team adoption strategies",
        "Measuring success metrics",
        "Common pitfalls to avoid"
      ]
    },
    {
      section: "Call to Action",
      duration: "13:30 - 15:00",
      content: [
        "Challenge: 'Try AI code review for 1 week'",
        "Free resources and tool links",
        "Subscribe for more dev productivity content"
      ]
    }
  ],
  keyPoints: [
    "AI code reviews are 5x faster than human reviews",
    "Consistency improves code quality across teams",
    "Developers can focus on architecture vs syntax",
    "ROI becomes positive within 2 weeks"
  ],
  seoKeywords: ["AI code review", "developer productivity", "automated code analysis", "software development tools"],
  hashtags: ["#AI", "#CodeReview", "#DevProductivity", "#SoftwareDevelopment", "#Programming"],
  estimatedViews: "15K - 45K",
  difficulty: "Beginner-friendly"
};