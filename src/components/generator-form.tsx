"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Profession, DocType } from "@/types/profession";
import { AdSlot } from "@/components/ad-slot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Loader2, Square } from "lucide-react";

type GeneratorFormProps = {
  profession: Profession;
};

export function GeneratorForm({ profession }: GeneratorFormProps) {
  const [docType, setDocType] = useState<DocType>("cover_letter");
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState<"professional" | "friendly">("professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const slotTop = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP?.trim();
  const slotBottom = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM?.trim();

  async function handleGenerate() {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!experience.trim() && !skills.trim()) {
      toast.error("Add at least one experience note or skill.");
      return;
    }

    controller?.abort();
    const nextController = new AbortController();
    setController(nextController);
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionSlug: profession.slug,
          docType,
          name: name.trim(),
          targetRole: targetRole.trim() || profession.jobTitle,
          experience: experience.trim(),
          skills: skills.trim(),
          tone,
        }),
        signal: nextController.signal,
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        toast.error(error.error || "Generation failed.");
        return;
      }

      if (!response.body) {
        toast.error("Empty response from server.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setResult(text);
      }

      toast.success("Document generated.");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setController(null);
    }
  }

  function handleStop() {
    controller?.abort();
    setLoading(false);
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard.");
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${profession.slug}-${docType}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <AdSlot slotId={slotTop} className="min-h-[90px] rounded-lg" />

        <Card>
          <CardHeader>
            <CardTitle>Generate your document</CardTitle>
            <CardDescription>
              Tailored for {profession.name.toLowerCase()} roles in the US job market.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              value={docType}
              onValueChange={(value) => setDocType(value as DocType)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cover_letter">Cover Letter</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
              </TabsList>
              <TabsContent value="cover_letter" className="mt-4" />
              <TabsContent value="resume" className="mt-4" />
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRole">Target role</Label>
              <Input
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder={profession.targetRolePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience & background</Label>
              <Textarea
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Jobs, clinical hours, certifications, achievements..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder={profession.samplePhrases.join(", ")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
              {loading && (
                <Button variant="outline" onClick={handleStop}>
                  <Square />
                  Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Review and edit before sending to employers.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!result}>
                <Copy />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!result}>
                <Download />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[420px] whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed">
              {result || (
                <span className="text-muted-foreground">
                  Your {docType === "resume" ? "resume" : "cover letter"} will appear here.
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <AdSlot slotId={slotBottom} className="min-h-[90px] rounded-lg" />
      </div>
    </div>
  );
}
