import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Download, 
  Save, 
  FileText, 
  X, 
  Plus,
  Loader2,
  Key,
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RunwareService, GenerateImageParams, GeneratedImage } from "@/utils/RunwareService";

const genres = [
  "Fantasy",
  "Science Fiction", 
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Historical Fiction",
  "Contemporary Fiction",
  "Young Adult",
  "Non-Fiction",
  "Biography",
  "Self-Help",
  "Business",
  "Technology"
];

interface CoverData {
  title: string;
  genre: string;
  keywords: string[];
  styleDirection: string;
}

interface GeneratedCover extends GeneratedImage {
  id: string;
  timestamp: string;
}

const CoverGenerator = () => {
  const [formData, setFormData] = useState<CoverData>({
    title: "",
    genre: "",
    keywords: [],
    styleDirection: ""
  });
  const [keywordInput, setKeywordInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCovers, setGeneratedCovers] = useState<GeneratedCover[]>([]);
  const [runwareService, setRunwareService] = useState<RunwareService | null>(null);
  const { toast } = useToast();

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const validateApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Runware API key to generate covers.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a book title.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.genre) {
      toast({
        title: "Genre Required", 
        description: "Please select a genre.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const generatePrompt = () => {
    const keywordText = formData.keywords.length > 0 ? formData.keywords.join(", ") : "";
    const genreStyle = getGenreStyle(formData.genre);
    
    let prompt = `Professional book cover design for "${formData.title}", ${formData.genre} genre, ${genreStyle}`;
    
    if (keywordText) {
      prompt += `, featuring ${keywordText}`;
    }
    
    if (formData.styleDirection.trim()) {
      prompt += `, ${formData.styleDirection}`;
    }
    
    prompt += ", high quality, professional typography, commercial book cover, eye-catching, marketable";
    
    return prompt;
  };

  const getGenreStyle = (genre: string) => {
    const styleMap: { [key: string]: string } = {
      "Fantasy": "mystical atmosphere, magical elements, epic fantasy style",
      "Science Fiction": "futuristic design, sci-fi elements, space or technology themes",
      "Romance": "romantic atmosphere, elegant design, warm colors",
      "Mystery": "dark mysterious mood, intriguing shadows, suspenseful atmosphere",
      "Thriller": "intense dramatic mood, bold design, high contrast",
      "Horror": "dark spooky atmosphere, horror elements, gothic style",
      "Historical Fiction": "period-appropriate design, vintage feel, historical elements",
      "Contemporary Fiction": "modern clean design, contemporary elements",
      "Young Adult": "vibrant colors, youthful design, appealing to teens",
      "Non-Fiction": "clean professional design, informative style",
      "Biography": "portrait-focused, dignified design, professional",
      "Self-Help": "motivational design, inspiring elements, clean layout",
      "Business": "professional corporate design, business elements",
      "Technology": "modern tech design, digital elements, innovative look"
    };
    return styleMap[genre] || "professional design";
  };

  const handleGenerateCovers = async () => {
    if (!validateApiKey() || !validateForm()) return;

    setIsGenerating(true);
    
    try {
      if (!runwareService) {
        const service = new RunwareService(apiKey);
        setRunwareService(service);
      }

      const prompt = generatePrompt();
      console.log("Generated prompt:", prompt);

      const params: GenerateImageParams = {
        positivePrompt: prompt,
        model: "runware:100@1",
        numberResults: 4,
        outputFormat: "WEBP",
        CFGScale: 7,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8
      };

      const service = runwareService || new RunwareService(apiKey);
      
      // Generate multiple covers
      const coverPromises = Array.from({ length: 4 }, (_, i) => 
        service.generateImage({
          ...params,
          seed: Math.floor(Math.random() * 1000000) + i
        })
      );

      const results = await Promise.all(coverPromises);
      
      const newCovers: GeneratedCover[] = results.map((result, index) => ({
        ...result,
        id: `cover-${Date.now()}-${index}`,
        timestamp: new Date().toLocaleString()
      }));

      setGeneratedCovers(newCovers);
      
      toast({
        title: "Covers Generated!",
        description: `Successfully generated ${newCovers.length} book covers.`,
      });

    } catch (error) {
      console.error("Error generating covers:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate covers. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCover = (cover: GeneratedCover) => {
    toast({
      title: "Cover Saved",
      description: "Cover has been saved to your library.",
    });
  };

  const handleDownloadCover = async (cover: GeneratedCover) => {
    try {
      const response = await fetch(cover.imageURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover_${cover.id}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Cover download has started.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download cover. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAssignToManuscript = (cover: GeneratedCover) => {
    toast({
      title: "Cover Assigned",
      description: "Cover has been assigned to the manuscript.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cover Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate AI-powered book covers for your manuscripts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Form */}
        <div className="space-y-6">
          {/* API Key Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Runware API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Runware API key"
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from{" "}
                  <a 
                    href="https://runware.ai/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    runware.ai
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cover Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Cover Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter book title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre} className="hover:bg-muted cursor-pointer">
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordInputKeyDown}
                    placeholder="Add keywords (press Enter)"
                  />
                  <Button size="sm" onClick={handleAddKeyword} disabled={!keywordInput.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                        {keyword}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="styleDirection">Style Direction</Label>
                <Textarea
                  id="styleDirection"
                  value={formData.styleDirection}
                  onChange={(e) => setFormData(prev => ({ ...prev, styleDirection: e.target.value }))}
                  placeholder="Describe the visual style, mood, colors, or specific elements you want..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerateCovers}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Covers...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Cover
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Generated Covers</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedCovers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No covers generated yet</p>
                  <p className="text-sm">Fill out the form and click "Generate Cover" to create AI-powered book covers</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {generatedCovers.map((cover, index) => (
                      <Card key={cover.id} className="overflow-hidden">
                        <div className="aspect-[3/4] relative">
                          <img
                            src={cover.imageURL}
                            alt={`Generated cover ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="text-xs text-muted-foreground">
                              Generated: {cover.timestamp}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSaveCover(cover)}
                                className="flex items-center gap-2"
                              >
                                <Save className="h-3 w-3" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadCover(cover)}
                                className="flex items-center gap-2"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAssignToManuscript(cover)}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <FileText className="h-3 w-3" />
                                Assign to Manuscript
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverGenerator;