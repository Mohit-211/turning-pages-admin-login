import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  UserPlus, 
  Shield, 
  UserX, 
  Edit3,
  CheckCircle,
  Clock,
  Settings,
  FileText,
  Users,
  Key,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock editors data
const mockEditors = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    email: "emily.carter@turningpages.com",
    role: "Super Admin",
    status: "active",
    avatar: "/api/placeholder/40/40",
    joinDate: "2023-01-15",
    lastActive: "2024-01-29"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@turningpages.com",
    role: "Senior Editor",
    status: "active",
    avatar: "/api/placeholder/40/40",
    joinDate: "2023-03-22",
    lastActive: "2024-01-28"
  },
  {
    id: 3,
    name: "Jessica Chen",
    email: "jessica.chen@turningpages.com",
    role: "Senior Editor",
    status: "active",
    avatar: "/api/placeholder/40/40",
    joinDate: "2023-05-10",
    lastActive: "2024-01-27"
  },
  {
    id: 4,
    name: "David Thompson",
    email: "david.thompson@turningpages.com",
    role: "Assistant Editor",
    status: "inactive",
    avatar: "/api/placeholder/40/40",
    joinDate: "2023-08-05",
    lastActive: "2024-01-20"
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@turningpages.com",
    role: "Assistant Editor",
    status: "active",
    avatar: "/api/placeholder/40/40",
    joinDate: "2023-11-18",
    lastActive: "2024-01-29"
  }
];

const rolePermissions = {
  "Super Admin": {
    color: "destructive",
    icon: Shield,
    permissions: [
      "Full system access",
      "Manage all users and editors",
      "Assign and reassign projects", 
      "Edit all manuscripts",
      "Deliver manuscripts to authors",
      "Access analytics and reports",
      "Manage system settings"
    ]
  },
  "Senior Editor": {
    color: "default",
    icon: Edit3,
    permissions: [
      "Assign projects to assistant editors",
      "Edit assigned manuscripts",
      "Review assistant editor work",
      "Deliver manuscripts to authors",
      "Access project analytics"
    ]
  },
  "Assistant Editor": {
    color: "secondary",
    icon: FileText,
    permissions: [
      "Edit assigned manuscripts only",
      "Add notes and comments",
      "Track editing progress",
      "Request senior editor review"
    ]
  }
};

const getRoleBadge = (role: string) => {
  const config = rolePermissions[role as keyof typeof rolePermissions];
  if (!config) return <Badge variant="outline">{role}</Badge>;
  
  return (
    <Badge variant={config.color as any} className="flex items-center gap-1">
      <config.icon className="h-3 w-3" />
      {role}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
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

const Editors = () => {
  const [editors, setEditors] = useState(mockEditors);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEditor, setNewEditor] = useState({
    name: "",
    email: "",
    role: "Assistant Editor"
  });
  const { toast } = useToast();

  const handleAddEditor = () => {
    if (!newEditor.name || !newEditor.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...editors.map(e => e.id)) + 1;
    const editorToAdd = {
      id: newId,
      ...newEditor,
      status: "active" as const,
      avatar: "/api/placeholder/40/40",
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };

    setEditors(prev => [...prev, editorToAdd]);
    setNewEditor({ name: "", email: "", role: "Assistant Editor" });
    setIsAddModalOpen(false);
    
    toast({
      title: "Editor Added",
      description: `${newEditor.name} has been added as ${newEditor.role}.`,
    });
  };

  const handleChangeRole = (editorId: number, newRole: string) => {
    setEditors(prev => prev.map(editor => 
      editor.id === editorId ? { ...editor, role: newRole } : editor
    ));
    
    const editor = editors.find(e => e.id === editorId);
    toast({
      title: "Role Updated",
      description: `${editor?.name}'s role has been updated to ${newRole}.`,
    });
  };

  const handleDeactivateEditor = (editorId: number) => {
    setEditors(prev => prev.map(editor => 
      editor.id === editorId ? { ...editor, status: editor.status === "active" ? "inactive" : "active" } : editor
    ));
    
    const editor = editors.find(e => e.id === editorId);
    const newStatus = editor?.status === "active" ? "inactive" : "active";
    toast({
      title: `Editor ${newStatus === "active" ? "Activated" : "Deactivated"}`,
      description: `${editor?.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    });
  };

  const activeEditors = editors.filter(editor => editor.status === "active").length;
  const superAdmins = editors.filter(editor => editor.role === "Super Admin").length;
  const seniorEditors = editors.filter(editor => editor.role === "Senior Editor").length;
  const assistantEditors = editors.filter(editor => editor.role === "Assistant Editor").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Access Controls</h1>
          <p className="text-muted-foreground mt-2">
            Manage editor accounts, roles, and permissions
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Editor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Editor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newEditor.name}
                  onChange={(e) => setNewEditor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEditor.email}
                  onChange={(e) => setNewEditor(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newEditor.role} onValueChange={(value) => setNewEditor(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    <SelectItem value="Assistant Editor">Assistant Editor</SelectItem>
                    <SelectItem value="Senior Editor">Senior Editor</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddEditor} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Add Editor
                </Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Editors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEditors}</div>
            <p className="text-xs text-muted-foreground">
              {editors.length - activeEditors} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{superAdmins}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Senior Editors</CardTitle>
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seniorEditors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assistant Editors</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assistantEditors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(rolePermissions).map(([role, config]) => (
              <div key={role} className="space-y-3">
                <div className="flex items-center gap-2">
                  <config.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{role}</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  {config.permissions.map((permission, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Editors ({editors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Editor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editors.map((editor) => (
                <TableRow key={editor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={editor.avatar} />
                        <AvatarFallback>{editor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{editor.name}</span>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(editor.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(editor.role)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{editor.email}</TableCell>
                  <TableCell>
                    {getStatusBadge(editor.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={editor.role}
                        onValueChange={(value) => handleChangeRole(editor.id, value)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border z-50">
                          <SelectItem value="Assistant Editor">Assistant Editor</SelectItem>
                          <SelectItem value="Senior Editor">Senior Editor</SelectItem>
                          <SelectItem value="Super Admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivateEditor(editor.id)}
                        className={editor.status === "active" ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                      >
                        {editor.status === "active" ? (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Editors;