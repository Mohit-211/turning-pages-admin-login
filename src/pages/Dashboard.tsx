import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  ArrowRight, 
  ExternalLink,
  TrendingUp,
  Activity
} from "lucide-react";

const kpiData = [
  {
    title: "Total Manuscripts Submitted",
    value: "1,247",
    icon: FileText,
    trend: "+12%",
    trendUp: true,
    description: "from last month",
    color: "text-blue-600"
  },
  {
    title: "In Progress",
    value: "89",
    icon: Clock,
    trend: "+5%",
    trendUp: true,
    description: "from last week",
    color: "text-orange-600"
  },
  {
    title: "Completed",
    value: "156",
    icon: CheckCircle,
    trend: "+23%",
    trendUp: true,
    description: "from last month",
    color: "text-green-600"
  },
  {
    title: "Total Users",
    value: "2,854",
    icon: Users,
    trend: "+8%",
    trendUp: true,
    description: "from last month",
    color: "text-primary"
  }
];

const recentActivities = [
  {
    id: 1,
    title: "New manuscript submitted: 'The Digital Renaissance'",
    author: "Sarah Johnson",
    status: "pending",
    timestamp: "2 minutes ago",
    type: "submission",
    link: "/editing-queue"
  },
  {
    id: 2,
    title: "Editorial review completed: 'Modern Poetry Collection'",
    author: "Michael Brown",
    status: "completed",
    timestamp: "15 minutes ago",
    type: "review",
    link: "/editing-queue"
  },
  {
    id: 3,
    title: "Manuscript approved: 'Science Fiction Anthology'",
    author: "Emma Davis",
    status: "approved",
    timestamp: "1 hour ago",
    type: "approval",
    link: "/projects"
  },
  {
    id: 4,
    title: "New user registered: John Smith",
    author: "System",
    status: "info",
    timestamp: "2 hours ago",
    type: "user",
    link: "/editors"
  },
  {
    id: 5,
    title: "Editorial feedback submitted: 'Historical Novel'",
    author: "Lisa Wilson",
    status: "in-progress",
    timestamp: "3 hours ago",
    type: "feedback",
    link: "/editorial-suite"
  },
  {
    id: 6,
    title: "Cover design requested: 'Mystery at Midnight'",
    author: "Alex Johnson",
    status: "pending",
    timestamp: "4 hours ago",
    type: "design",
    link: "/cover-generator"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "completed":
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    case "approved":
      return <Badge className="bg-success text-success-foreground">Approved</Badge>;
    case "in-progress":
      return <Badge className="bg-warning text-warning-foreground">In Progress</Badge>;
    case "info":
      return <Badge className="bg-info text-info-foreground">Info</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleActivityClick = (link: string) => {
    navigate(link);
  };

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Turning Pages Admin Panel
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className={`mr-1 h-3 w-3 ${kpi.trendUp ? 'text-green-600' : 'text-red-600'} ${!kpi.trendUp ? 'rotate-180' : ''}`} />
                <span className={kpi.trendUp ? 'text-green-600' : 'text-red-600'}>{kpi.trend}</span>
                <span className="ml-1">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => handleQuickLinkClick('/projects')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-between p-4 h-auto"
            >
              <div className="text-left">
                <div className="font-semibold">View All Projects</div>
                <div className="text-xs opacity-90">Manage active projects</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => handleQuickLinkClick('/editors')}
              variant="outline"
              className="flex items-center justify-between p-4 h-auto hover:bg-muted"
            >
              <div className="text-left">
                <div className="font-semibold">View Users</div>
                <div className="text-xs text-muted-foreground">User management</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => handleQuickLinkClick('/editing-queue')}
              variant="outline"
              className="flex items-center justify-between p-4 h-auto hover:bg-muted"
            >
              <div className="text-left">
                <div className="font-semibold">Editing Queue</div>
                <div className="text-xs text-muted-foreground">Review submissions</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => handleQuickLinkClick('/analytics')}
              variant="outline"
              className="flex items-center justify-between p-4 h-auto hover:bg-muted"
            >
              <div className="text-left">
                <div className="font-semibold">Analytics</div>
                <div className="text-xs text-muted-foreground">View reports</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start justify-between p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => handleActivityClick(activity.link)}
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">by {activity.author}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(activity.status)}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => handleQuickLinkClick('/editing-queue')}
              className="w-full justify-center text-muted-foreground hover:text-primary"
            >
              View All Activities
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;