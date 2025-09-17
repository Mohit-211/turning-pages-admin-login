import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, Users } from "lucide-react";

const kpiData = [
  {
    title: "Total Manuscripts Submitted",
    value: "1,247",
    icon: FileText,
    trend: "+12% from last month"
  },
  {
    title: "Manuscripts In Progress",
    value: "89",
    icon: Clock,
    trend: "+5% from last week"
  },
  {
    title: "Manuscripts Completed",
    value: "156",
    icon: CheckCircle,
    trend: "+23% from last month"
  },
  {
    title: "Total Users",
    value: "2,854",
    icon: Users,
    trend: "+8% from last month"
  }
];

const recentActivities = [
  {
    id: 1,
    title: "New manuscript submitted: 'The Digital Renaissance'",
    author: "Sarah Johnson",
    status: "pending",
    timestamp: "2 minutes ago"
  },
  {
    id: 2,
    title: "Editorial review completed: 'Modern Poetry Collection'",
    author: "Michael Brown",
    status: "completed",
    timestamp: "15 minutes ago"
  },
  {
    id: 3,
    title: "Manuscript approved: 'Science Fiction Anthology'",
    author: "Emma Davis",
    status: "approved",
    timestamp: "1 hour ago"
  },
  {
    id: 4,
    title: "New user registered: John Smith",
    author: "System",
    status: "info",
    timestamp: "2 hours ago"
  },
  {
    id: 5,
    title: "Editorial feedback submitted: 'Historical Novel'",
    author: "Lisa Wilson",
    status: "in-progress",
    timestamp: "3 hours ago"
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
          <Card key={index} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between p-4 border rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">by {activity.author}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(activity.status)}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;