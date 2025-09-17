import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  Eye, 
  UserX, 
  RotateCcw, 
  CalendarIcon,
  Mail,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users as UsersIcon
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/api/placeholder/40/40",
    manuscriptCount: 4,
    lastLogin: "2024-01-28",
    accountStatus: "active",
    joinDate: "2023-05-15",
    bio: "Technology writer with over 10 years of experience in digital transformation and AI.",
    projects: [
      { id: 1, title: "The Digital Renaissance", status: "in-progress" },
      { id: 2, title: "Machine Learning Basics", status: "completed" },
      { id: 3, title: "The Future of AI", status: "delivered" },
      { id: 4, title: "Digital Transformation Guide", status: "in-progress" }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    avatar: "/api/placeholder/40/40",
    manuscriptCount: 2,
    lastLogin: "2024-01-27",
    accountStatus: "active",
    joinDate: "2023-08-22",
    bio: "Business consultant specializing in startup growth strategies.",
    projects: [
      { id: 5, title: "Startup Success Framework", status: "completed" },
      { id: 6, title: "Leadership in Digital Age", status: "submitted" }
    ]
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma.rodriguez@email.com",
    avatar: "/api/placeholder/40/40",
    manuscriptCount: 1,
    lastLogin: "2024-01-20",
    accountStatus: "inactive",
    joinDate: "2023-12-01",
    bio: "Marketing professional with expertise in content strategy and brand development.",
    projects: [
      { id: 7, title: "Content Marketing Mastery", status: "submitted" }
    ]
  },
  {
    id: 4,
    name: "David Thompson",
    email: "david.thompson@email.com",
    avatar: "/api/placeholder/40/40",
    manuscriptCount: 6,
    lastLogin: "2024-01-29",
    accountStatus: "active",
    joinDate: "2023-03-10",
    bio: "Financial advisor and author of multiple books on personal finance.",
    projects: [
      { id: 8, title: "Personal Finance Guide", status: "delivered" },
      { id: 9, title: "Investment Strategies", status: "completed" },
      { id: 10, title: "Retirement Planning", status: "in-progress" },
      { id: 11, title: "Tax Optimization", status: "submitted" },
      { id: 12, title: "Real Estate Investment", status: "completed" },
      { id: 13, title: "Cryptocurrency Basics", status: "in-progress" }
    ]
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    avatar: "/api/placeholder/40/40",
    manuscriptCount: 3,
    lastLogin: "2024-01-25",
    accountStatus: "active",
    joinDate: "2023-07-18",
    bio: "Healthcare professional and medical writer focusing on patient education.",
    projects: [
      { id: 14, title: "Understanding Diabetes", status: "delivered" },
      { id: 15, title: "Mental Health Awareness", status: "completed" },
      { id: 16, title: "Healthy Living Guide", status: "in-progress" }
    ]
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "submitted":
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Submitted</Badge>;
    case "in-progress":
      return <Badge className="bg-info text-info-foreground">In Progress</Badge>;
    case "completed":
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    case "delivered":
      return <Badge className="bg-primary text-primary-foreground">Delivered</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getAccountStatusBadge = (status: string) => {
  return status === "active" ? (
    <Badge className="bg-success text-success-foreground">
      <CheckCircle className="h-3 w-3 mr-1" />
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="text-muted-foreground">
      <Clock className="h-3 w-3 mr-1" />
      Inactive
    </Badge>
  );
};

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [manuscriptFilter, setManuscriptFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.accountStatus === statusFilter;
    
    const matchesManuscripts = manuscriptFilter === "all" || 
      (manuscriptFilter === "1-3" && user.manuscriptCount >= 1 && user.manuscriptCount <= 3) ||
      (manuscriptFilter === "4-6" && user.manuscriptCount >= 4 && user.manuscriptCount <= 6) ||
      (manuscriptFilter === "7+" && user.manuscriptCount >= 7);
    
    const matchesDate = dateFilter === "all" || 
      (dateFilter === "2024" && user.joinDate.startsWith("2024")) ||
      (dateFilter === "2023" && user.joinDate.startsWith("2023"));

    return matchesSearch && matchesStatus && matchesManuscripts && matchesDate;
  });

  const handleViewProfile = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleDeactivateUser = (userId: number, userName: string) => {
    toast({
      title: "User Deactivated",
      description: `${userName}'s account has been deactivated.`,
    });
  };

  const handleResetPassword = (userId: number, userName: string) => {
    toast({
      title: "Password Reset",
      description: `Password reset email sent to ${userName}.`,
    });
  };

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(user => user.accountStatus === "active").length;
  const inactiveUsers = totalUsers - activeUsers;
  const totalManuscripts = mockUsers.reduce((sum, user) => sum + user.manuscriptCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage user accounts and monitor activity
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Manuscripts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalManuscripts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Manuscripts Count</label>
              <Select value={manuscriptFilter} onValueChange={setManuscriptFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Counts" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">All Counts</SelectItem>
                  <SelectItem value="1-3">1-3 Manuscripts</SelectItem>
                  <SelectItem value="4-6">4-6 Manuscripts</SelectItem>
                  <SelectItem value="7+">7+ Manuscripts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Joined</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Manuscripts</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user.manuscriptCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(user.lastLogin), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {getAccountStatusBadge(user.accountStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(user)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivateUser(user.id, user.name)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user.id, user.name)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {format(new Date(selectedUser.joinDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="mt-2">
                    {getAccountStatusBadge(selectedUser.accountStatus)}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{selectedUser.bio}</p>
              </div>

              <Separator />

              {/* Projects */}
              <div>
                <h4 className="font-medium mb-3">
                  Projects ({selectedUser.projects.length})
                </h4>
                <div className="space-y-3">
                  {selectedUser.projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{project.title}</h5>
                        <p className="text-sm text-muted-foreground">Project ID: {project.id}</p>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Account Actions */}
              <div>
                <h4 className="font-medium mb-3">Account Actions</h4>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDeactivateUser(selectedUser.id, selectedUser.name);
                      setIsProfileModalOpen(false);
                    }}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleResetPassword(selectedUser.id, selectedUser.name);
                      setIsProfileModalOpen(false);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;