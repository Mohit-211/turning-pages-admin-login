import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, BookOpen, Hash, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dummy data
const manuscript = {
  id: 1,
  title: "The Art of Digital Storytelling",
  author: "Sarah Mitchell",
  genre: "Technology",
  wordCount: 85000,
  submissionDate: "2024-01-15",
  status: "submitted"
};

const editors = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    role: "Super Admin",
    available: true,
    email: "emily.carter@turningpages.com"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Senior Editor",
    available: false,
    email: "marcus.rodriguez@turningpages.com"
  },
  {
    id: 3,
    name: "Jessica Chen",
    role: "Senior Editor",
    available: true,
    email: "jessica.chen@turningpages.com"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Assistant Editor",
    available: true,
    email: "david.thompson@turningpages.com"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Assistant Editor",
    available: false,
    email: "lisa.wang@turningpages.com"
  }
];

const stages = [
  { name: "Submitted", completed: true },
  { name: "In Progress", completed: false },
  { name: "Delivered", completed: false },
  { name: "Completed", completed: false }
];

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "Super Admin":
      return "destructive";
    case "Senior Editor":
      return "default";
    case "Assistant Editor":
      return "secondary";
    default:
      return "outline";
  }
};

const AssignProject = () => {
  const [selectedEditor, setSelectedEditor] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const manuscriptId = searchParams.get("id");

  const handleAssignProject = () => {
    if (!selectedEditor) {
      toast({
        title: "Error",
        description: "Please select an editor to assign the project.",
        variant: "destructive",
      });
      return;
    }

    const editor = editors.find(e => e.id.toString() === selectedEditor);
    toast({
      title: "Project Assigned Successfully",
      description: `"${manuscript.title}" has been assigned to ${editor?.name}.`,
    });
    
    // Navigate back to editing queue
    navigate("/editing-queue");
  };

  const handleBack = () => {
    navigate("/editing-queue");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assign Project</h1>
          <p className="text-muted-foreground mt-1">
            Assign manuscript to an available editor
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Manuscript Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Manuscript Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    Title
                  </div>
                  <p className="font-semibold">{manuscript.title}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Author
                  </div>
                  <p className="font-semibold">{manuscript.author}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    Genre
                  </div>
                  <Badge variant="outline">{manuscript.genre}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    Word Count
                  </div>
                  <p className="font-semibold">{manuscript.wordCount.toLocaleString()}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Submission Date
                  </div>
                  <p className="font-semibold">
                    {new Date(manuscript.submissionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Editor Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select Editor
                </label>
                <Select value={selectedEditor} onValueChange={setSelectedEditor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an editor..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {editors.map((editor) => (
                      <SelectItem 
                        key={editor.id} 
                        value={editor.id.toString()}
                        className="hover:bg-muted cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                editor.available ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <span className="font-medium">{editor.name}</span>
                            </div>
                            <Badge variant={getRoleBadgeVariant(editor.role)} className="text-xs">
                              {editor.role}
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Editor Status Legend */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Busy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Timeline Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={stage.name} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        stage.completed 
                          ? 'bg-primary border-primary' 
                          : index === 1 
                            ? 'bg-primary border-primary'
                            : 'bg-background border-muted-foreground'
                      }`} />
                      {index < stages.length - 1 && (
                        <div className={`w-0.5 h-8 mt-2 ${
                          stage.completed ? 'bg-primary' : 'bg-muted-foreground'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        stage.completed || index === 1
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`}>
                        {stage.name}
                      </h4>
                      {stage.completed && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Completed
                        </p>
                      )}
                      {index === 1 && (
                        <p className="text-xs text-primary mt-1">
                          Next Stage
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assignment Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleAssignProject}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Assign Project
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignProject;