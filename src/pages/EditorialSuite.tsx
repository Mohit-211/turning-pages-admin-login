import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  BookOpen, 
  Plus, 
  Play, 
  Save, 
  Send, 
  FileText, 
  Search, 
  Copy, 
  StickyNote,
  Check,
  X,
  Eye,
  EyeOff,
  Download,
  ChevronDown,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const chapters = [
  { id: 1, title: "Chapter 1: The Beginning", wordCount: 2500, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." },
  { id: 2, title: "Chapter 2: Rising Action", wordCount: 3200, content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." },
  { id: 3, title: "Chapter 3: The Climax", wordCount: 2800, content: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem." },
];

const aiTools = [
  "Developmental",
  "Line Edit", 
  "Copyedit",
  "Proofread",
  "Fact-Check",
  "Consistency",
  "Formatting"
];

const aiSuggestions = [
  {
    id: 1,
    type: "Grammar",
    original: "Their going to the store",
    suggested: "They're going to the store",
    reason: "Incorrect usage of 'their' instead of 'they're'"
  },
  {
    id: 2,
    type: "Style",
    original: "He walked very quickly",
    suggested: "He hurried",
    reason: "More concise and impactful word choice"
  },
  {
    id: 3,
    type: "Clarity",
    original: "The thing that happened was unexpected",
    suggested: "The incident was unexpected",
    reason: "Replace vague 'thing' with specific term"
  }
];

const plagiarismResults = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    similarity: 95,
    source: "Wikipedia - Lorem Ipsum",
    url: "https://en.wikipedia.org/wiki/Lorem_ipsum",
    startIndex: 0,
    endIndex: 50,
    status: "high-risk"
  },
  {
    id: 2,
    text: "Sed do eiusmod tempor incididunt ut labore",
    similarity: 87,
    source: "Sample Text Database",
    url: "https://example.com/sample-texts",
    startIndex: 200,
    endIndex: 240,
    status: "needs-review"
  },
  {
    id: 3,
    text: "Ut enim ad minim veniam, quis nostrud exercitation",
    similarity: 45,
    source: "Generic Text Collection",
    url: "https://example.com/generic-texts",
    startIndex: 300,
    endIndex: 348,
    status: "acceptable"
  }
];

const overallSimilarity = 72;

const summaries = {
  chapter: {
    text: "This chapter introduces the main character and establishes the setting in a small coastal town. The protagonist faces their first major challenge when they discover a mysterious letter.",
    generated: "2024-01-15 14:30:00",
    isGenerated: true
  },
  midBook: {
    text: "The story progresses as our protagonist uncovers a conspiracy involving the town's founding families. Alliances are formed and broken as the mystery deepens.",
    generated: "2024-01-15 14:32:00",
    isGenerated: true
  },
  full: {
    text: "A compelling mystery novel that follows a young investigator as they uncover dark secrets in their hometown. The story masterfully weaves together family drama, historical intrigue, and personal growth in a satisfying conclusion.",
    generated: "2024-01-15 14:35:00",
    isGenerated: true
  }
};

const EditorialSuite = () => {
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]);
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [editorContent, setEditorContent] = useState(selectedChapter.content);
  const [showTrackChanges, setShowTrackChanges] = useState(false);
  const [notes, setNotes] = useState("");
  const [highlightedMatch, setHighlightedMatch] = useState<number | null>(null);
  const [isPlagiarismActive, setIsPlagiarismActive] = useState(false);
  const [summaryStates, setSummaryStates] = useState(summaries);
  const [expandedSummaries, setExpandedSummaries] = useState<string[]>(["chapter", "midBook", "full"]);
  const [generatingSummary, setGeneratingSummary] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChapterSelect = (chapter: typeof chapters[0]) => {
    setSelectedChapter(chapter);
    setEditorContent(chapter.content);
  };

  const handleRunTool = () => {
    if (!selectedTool) {
      toast({
        title: "Select AI Tool",
        description: "Please select an AI tool before running analysis.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "AI Tool Running",
      description: `${selectedTool} analysis started for ${selectedChapter.title}.`,
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleDeliverManuscript = () => {
    navigate("/deliver-manuscript?id=1");
  };

  const handleAcceptSuggestion = (suggestionId: number) => {
    toast({
      title: "Suggestion Accepted",
      description: "The AI suggestion has been applied to the text.",
    });
  };

  const handleRejectSuggestion = (suggestionId: number) => {
    toast({
      title: "Suggestion Rejected",
      description: "The AI suggestion has been dismissed.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high-risk":
        return "bg-red-100 text-red-800 border-red-200";
      case "needs-review":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "acceptable":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "high-risk": return "High Risk";
      case "needs-review": return "Needs Review";
      case "acceptable": return "Acceptable";
      default: return "Unknown";
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return "text-red-600";
    if (similarity >= 60) return "text-orange-600";
    return "text-green-600";
  };

  const handleFlagSection = (resultId: number) => {
    toast({
      title: "Section Flagged",
      description: "This section has been flagged for review and client notification.",
    });
  };

  const handleSuggestRewrite = (resultId: number) => {
    toast({
      title: "Rewrite Suggested",
      description: "AI rewrite suggestion has been generated for this section.",
    });
  };

  const generateSummary = async (type: "chapter" | "midBook" | "full") => {
    setGeneratingSummary(type);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const newSummary = {
        text: getSummaryText(type),
        generated: new Date().toLocaleString(),
        isGenerated: true
      };
      
      setSummaryStates(prev => ({
        ...prev,
        [type]: newSummary
      }));
      
      // Expand the card when new summary is generated
      if (!expandedSummaries.includes(type)) {
        setExpandedSummaries(prev => [...prev, type]);
      }
      
      setGeneratingSummary(null);
      toast({
        title: "Summary Generated",
        description: `${getSummaryTitle(type)} has been generated successfully.`,
      });
    }, 2000);
  };

  const getSummaryText = (type: string) => {
    const summaryTexts = {
      chapter: `This chapter introduces the main character and establishes the setting in a small coastal town. The protagonist faces their first major challenge when they discover a mysterious letter. The narrative style combines elements of mystery and character development, setting up key plot points for future chapters.`,
      midBook: `The story progresses as our protagonist uncovers a conspiracy involving the town's founding families. Alliances are formed and broken as the mystery deepens. Character relationships become more complex, and the stakes are raised significantly as secrets from the past begin to surface.`,
      full: `A compelling mystery novel that follows a young investigator as they uncover dark secrets in their hometown. The story masterfully weaves together family drama, historical intrigue, and personal growth in a satisfying conclusion. The narrative maintains excellent pacing throughout while developing rich, multi-dimensional characters.`
    };
    return summaryTexts[type] || "Summary generated successfully.";
  };

  const getSummaryTitle = (type: string) => {
    const titles = {
      chapter: "Chapter Summary",
      midBook: "Mid-Book Summary", 
      full: "Full Synopsis"
    };
    return titles[type] || "Summary";
  };

  const toggleSummaryExpansion = (type: string) => {
    setExpandedSummaries(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const downloadSummary = (type: string, text: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${type}-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Summary Downloaded",
      description: `${getSummaryTitle(type)} has been downloaded successfully.`,
    });
  };

  const renderHighlightedText = (text: string) => {
    if (!isPlagiarismActive) return text;
    
    let highlightedText = text;
    
    plagiarismResults.forEach((result, index) => {
      const highlightClass = highlightedMatch === result.id 
        ? "bg-red-300 border-b-2 border-red-500" 
        : "bg-red-100 border-b border-red-300";
      
      highlightedText = highlightedText.replace(
        result.text,
        `<span 
          class="${highlightClass} cursor-pointer transition-colors" 
          onmouseenter="this.classList.add('bg-red-200')" 
          onmouseleave="this.classList.remove('bg-red-200')"
          data-match-id="${result.id}"
        >${result.text}</span>`
      );
    });
    
    return highlightedText;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Action Bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editorial Suite</h1>
            <p className="text-sm text-muted-foreground">
              Currently editing: {selectedChapter.title}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select AI Tool" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {aiTools.map((tool) => (
                  <SelectItem key={tool} value={tool} className="hover:bg-muted cursor-pointer">
                    {tool}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleRunTool} className="bg-primary hover:bg-primary/90">
              <Play className="h-4 w-4 mr-2" />
              Run Tool
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleDeliverManuscript} className="bg-success hover:bg-success/90 text-success-foreground">
              <Send className="h-4 w-4 mr-2" />
              Deliver Manuscript
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chapters */}
        <div className="w-80 border-r bg-card">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Chapters</h3>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {chapters.map((chapter) => (
                <Card 
                  key={chapter.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedChapter.id === chapter.id ? 'ring-2 ring-primary bg-muted' : ''
                  }`}
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{chapter.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {chapter.wordCount.toLocaleString()} words
                        </p>
                      </div>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedChapter.title}</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Track Changes</label>
                <Switch 
                  checked={showTrackChanges} 
                  onCheckedChange={setShowTrackChanges}
                />
                {showTrackChanges ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </div>
            </div>
          </div>
          <div className="flex-1 p-4">
            {isPlagiarismActive ? (
              <div 
                className="w-full h-full p-4 border rounded-lg bg-background text-base leading-relaxed overflow-auto whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: renderHighlightedText(editorContent) }}
              />
            ) : (
              <Textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full h-full resize-none border-0 shadow-none focus-visible:ring-0 text-base leading-relaxed"
                placeholder="Start editing the chapter content..."
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - Tabbed */}
        <div className="w-96 border-l bg-card">
          <Tabs defaultValue="suggestions" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger 
                value="suggestions" 
                className="text-xs"
                onClick={() => setIsPlagiarismActive(false)}
              >
                AI
              </TabsTrigger>
              <TabsTrigger 
                value="plagiarism" 
                className="text-xs"
                onClick={() => setIsPlagiarismActive(true)}
              >
                Plagiarism
              </TabsTrigger>
              <TabsTrigger 
                value="summaries" 
                className="text-xs"
                onClick={() => setIsPlagiarismActive(false)}
              >
                Summary
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="text-xs"
                onClick={() => setIsPlagiarismActive(false)}
              >
                Notes
              </TabsTrigger>
            </TabsList>

            {/* AI Suggestions Tab */}
            <TabsContent value="suggestions" className="flex-1 m-0">
              <div className="p-4">
                <h3 className="font-semibold mb-4">AI Suggestions</h3>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-4">
                    {aiSuggestions.map((suggestion) => (
                      <Card key={suggestion.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type}
                            </Badge>
                            <div>
                              <p className="text-sm text-muted-foreground">Original:</p>
                              <p className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-200">
                                {suggestion.original}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Suggested:</p>
                              <p className="text-sm bg-green-50 p-2 rounded border-l-4 border-green-200">
                                {suggestion.suggested}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {suggestion.reason}
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAcceptSuggestion(suggestion.id)}
                                className="bg-success hover:bg-success/90 text-success-foreground"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectSuggestion(suggestion.id)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Plagiarism Check Tab */}
            <TabsContent value="plagiarism" className="flex-1 m-0">
              <div className="p-4 h-full flex flex-col">
                <h3 className="font-semibold mb-4">Plagiarism Analysis</h3>
                
                {/* Overall Result Card */}
                <Card className="mb-6 border-2">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getSimilarityColor(overallSimilarity)}`}>
                        {overallSimilarity}%
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        Overall Similarity Score
                      </div>
                      <Badge 
                        className={`${getStatusColor(
                          overallSimilarity >= 80 ? "high-risk" : 
                          overallSimilarity >= 60 ? "needs-review" : "acceptable"
                        )} border`}
                      >
                        {getStatusLabel(
                          overallSimilarity >= 80 ? "high-risk" : 
                          overallSimilarity >= 60 ? "needs-review" : "acceptable"
                        )}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Sources List */}
                <div className="flex-1">
                  <h4 className="font-medium mb-3 text-sm">Detected Sources ({plagiarismResults.length})</h4>
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <div className="space-y-3">
                      {plagiarismResults.map((result) => (
                        <Card 
                          key={result.id} 
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            highlightedMatch === result.id ? 'ring-2 ring-primary shadow-md' : ''
                          }`}
                          onMouseEnter={() => setHighlightedMatch(result.id)}
                          onMouseLeave={() => setHighlightedMatch(null)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge 
                                  className={`text-xs ${getSimilarityColor(result.similarity)} bg-white border`}
                                >
                                  {result.similarity}% Match
                                </Badge>
                                <Badge 
                                  className={`${getStatusColor(result.status)} text-xs border`}
                                >
                                  {getStatusLabel(result.status)}
                                </Badge>
                              </div>
                              
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Matched Text:</p>
                                <p className="text-sm bg-red-50 p-2 rounded mt-1 border-l-3 border-red-200">
                                  "{result.text}"
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Source:</p>
                                <p className="text-sm font-medium">{result.source}</p>
                                <a 
                                  href={result.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                                >
                                  <Search className="h-3 w-3" />
                                  View Source
                                </a>
                              </div>
                              
                              <div className="flex gap-2 pt-2">
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleFlagSection(result.id)}
                                  className="text-xs"
                                >
                                  Flag Section
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleSuggestRewrite(result.id)}
                                  className="text-xs"
                                >
                                  Suggest Rewrite
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            {/* Summaries Tab */}
            <TabsContent value="summaries" className="flex-1 m-0">
              <div className="p-4 h-full flex flex-col">
                <h3 className="font-semibold mb-4">AI Summaries</h3>
                
                {/* Generation Buttons */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  <Button 
                    onClick={() => generateSummary("chapter")}
                    disabled={generatingSummary === "chapter"}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {generatingSummary === "chapter" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Chapter Summary
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => generateSummary("midBook")}
                    disabled={generatingSummary === "midBook"}
                    variant="outline"
                  >
                    {generatingSummary === "midBook" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Mid-Book Summary
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => generateSummary("full")}
                    disabled={generatingSummary === "full"}
                    variant="outline"
                  >
                    {generatingSummary === "full" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Full Synopsis
                      </>
                    )}
                  </Button>
                </div>

                {/* Results */}
                <div className="flex-1">
                  <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="space-y-4">
                      {/* Chapter Summary */}
                      {summaryStates.chapter.isGenerated && (
                        <Card className="border-2">
                          <CardHeader 
                            className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleSummaryExpansion("chapter")}
                          >
                            <CardTitle className="text-sm flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {expandedSummaries.includes("chapter") ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                Chapter Summary
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-normal">
                                  {summaryStates.chapter.generated}
                                </span>
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => copyToClipboard(summaryStates.chapter.text)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => downloadSummary("chapter", summaryStates.chapter.text)}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          {expandedSummaries.includes("chapter") && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {summaryStates.chapter.text}
                              </p>
                            </CardContent>
                          )}
                        </Card>
                      )}

                      {/* Mid-Book Summary */}
                      {summaryStates.midBook.isGenerated && (
                        <Card className="border-2">
                          <CardHeader 
                            className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleSummaryExpansion("midBook")}
                          >
                            <CardTitle className="text-sm flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {expandedSummaries.includes("midBook") ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                Mid-Book Summary
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-normal">
                                  {summaryStates.midBook.generated}
                                </span>
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => copyToClipboard(summaryStates.midBook.text)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => downloadSummary("midBook", summaryStates.midBook.text)}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          {expandedSummaries.includes("midBook") && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {summaryStates.midBook.text}
                              </p>
                            </CardContent>
                          )}
                        </Card>
                      )}

                      {/* Full Synopsis */}
                      {summaryStates.full.isGenerated && (
                        <Card className="border-2">
                          <CardHeader 
                            className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleSummaryExpansion("full")}
                          >
                            <CardTitle className="text-sm flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {expandedSummaries.includes("full") ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                Full Synopsis
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-normal">
                                  {summaryStates.full.generated}
                                </span>
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => copyToClipboard(summaryStates.full.text)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => downloadSummary("full", summaryStates.full.text)}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          {expandedSummaries.includes("full") && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {summaryStates.full.text}
                              </p>
                            </CardContent>
                          )}
                        </Card>
                      )}

                      {/* Empty State */}
                      {!summaryStates.chapter.isGenerated && !summaryStates.midBook.isGenerated && !summaryStates.full.isGenerated && (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">No summaries generated yet.</p>
                          <p className="text-xs mt-1">Click the generate buttons above to create AI summaries.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="flex-1 m-0">
              <div className="p-4 h-full flex flex-col">
                <h3 className="font-semibold mb-4">Project Notes</h3>
                <div className="flex-1">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your project notes here..."
                    className="w-full h-full resize-none"
                  />
                </div>
                <Button 
                  onClick={() => toast({ title: "Notes Saved", description: "Your notes have been saved." })}
                  className="mt-4"
                  size="sm"
                >
                  <StickyNote className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EditorialSuite;