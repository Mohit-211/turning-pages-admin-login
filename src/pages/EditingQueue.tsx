import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Eye, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Manuscript {
  id: string;
  title: string;
  author: string;
  genre: string;
  wordCount: number;
  submissionDate: string;
  status: "submitted" | "in-progress" | "delivered" | "completed";
  submissionNotes: string;
}

const mockManuscripts: Manuscript[] = [
  {
    id: "1",
    title: "The Digital Renaissance",
    author: "Sarah Johnson",
    genre: "Technology",
    wordCount: 89500,
    submissionDate: "2024-01-15",
    status: "submitted",
    submissionNotes: "First-time author looking for comprehensive editing support. Manuscript focuses on the intersection of AI and human creativity."
  },
  {
    id: "2",
    title: "Modern Poetry Collection",
    author: "Michael Brown",
    genre: "Poetry",
    wordCount: 12000,
    submissionDate: "2024-01-20",
    status: "in-progress",
    submissionNotes: "Collection of 50 contemporary poems. Author prefers minimal structural changes but open to stylistic suggestions."
  },
  {
    id: "3",
    title: "Science Fiction Anthology",
    author: "Emma Davis",
    genre: "Science Fiction",
    wordCount: 125000,
    submissionDate: "2024-01-10",
    status: "delivered",
    submissionNotes: "Anthology of 12 short stories. Author requests consistency check across all stories and character development feedback."
  },
  {
    id: "4",
    title: "Historical Novel: The Last Knight",
    author: "Robert Wilson",
    genre: "Historical Fiction",
    wordCount: 95000,
    submissionDate: "2024-01-25",
    status: "completed",
    submissionNotes: "Medieval historical fiction. Author is concerned about historical accuracy and period-appropriate dialogue."
  },
  {
    id: "5",
    title: "Business Strategy Guide",
    author: "Lisa Anderson",
    genre: "Business",
    wordCount: 67000,
    submissionDate: "2024-01-30",
    status: "in-progress",
    submissionNotes: "Professional development book. Target audience is mid-level managers. Needs clarity and structure improvements."
  }
];

const genres = ["All Genres", "Technology", "Poetry", "Science Fiction", "Historical Fiction", "Business", "Romance", "Mystery", "Non-Fiction"];
const statuses = ["All Statuses", "submitted", "in-progress", "delivered", "completed"];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "submitted":
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Submitted</Badge>;
    case "in-progress":
      return <Badge className="bg-info text-info-foreground">In Progress</Badge>;
    case "delivered":
      return <Badge className="bg-success text-success-foreground">Delivered</Badge>;
    case "completed":
      return <Badge className="bg-primary text-primary-foreground">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const EditingQueue = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All Genres");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredManuscripts = mockManuscripts.filter((manuscript) => {
    if (selectedGenre !== "All Genres" && manuscript.genre !== selectedGenre) return false;
    if (selectedStatus !== "All Statuses" && manuscript.status !== selectedStatus) return false;
    if (selectedDate && manuscript.submissionDate !== format(selectedDate, "yyyy-MM-dd")) return false;
    return true;
  });

  const handleViewManuscript = (manuscript: Manuscript) => {
    setSelectedManuscript(manuscript);
    setIsModalOpen(true);
  };

  const formatWordCount = (count: number) => {
    return count.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Editing Queue</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track manuscripts in the editorial pipeline
        </p>
      </div>

      {/* Filter Row */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All Statuses" ? status : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Submission Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-48 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGenre("All Genres");
                  setSelectedStatus("All Statuses");
                  setSelectedDate(undefined);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manuscript Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Manuscripts ({filteredManuscripts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Author Name</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Word Count</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManuscripts.map((manuscript) => (
                <TableRow key={manuscript.id}>
                  <TableCell className="font-medium">{manuscript.title}</TableCell>
                  <TableCell>{manuscript.author}</TableCell>
                  <TableCell>{manuscript.genre}</TableCell>
                  <TableCell>{formatWordCount(manuscript.wordCount)}</TableCell>
                  <TableCell>{format(new Date(manuscript.submissionDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(manuscript.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewManuscript(manuscript)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Manuscript
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredManuscripts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No manuscripts found matching the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Manuscript Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manuscript Details</DialogTitle>
            <DialogDescription>
              Review manuscript information and take action
            </DialogDescription>
          </DialogHeader>
          
          {selectedManuscript && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="text-lg font-semibold">{selectedManuscript.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Author</label>
                  <p className="text-lg font-semibold">{selectedManuscript.author}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Genre</label>
                  <p>{selectedManuscript.genre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Word Count</label>
                  <p>{formatWordCount(selectedManuscript.wordCount)} words</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
                  <p>{format(new Date(selectedManuscript.submissionDate), "MMMM dd, yyyy")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedManuscript.status)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Submission Notes</label>
                <p className="mt-1 text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                  {selectedManuscript.submissionNotes}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  Assign Project
                </Button>
                <Button variant="outline">
                  Open in Editorial Suite
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditingQueue;