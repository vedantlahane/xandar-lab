'use client'

import { Button } from '@/components/ui/button'
import { FileText, LayoutTemplate, Briefcase, Code, Calendar } from 'lucide-react'

const TEMPLATES = [
    {
        id: 'meeting',
        name: 'Meeting Notes',
        icon: Briefcase,
        description: 'Standard format for tracking attendees, discussion, and action items.',
        content: `<h2>Meeting Notes</h2>
<p><strong>Date:</strong> </p>
<p><strong>Attendees:</strong> </p>
<h3>Agenda</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="false">Item 1</li>
</ul>
<h3>Discussion</h3>
<p></p>
<h3>Action Items</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="false">Action 1</li>
</ul>`
    },
    {
        id: 'project',
        name: 'Project Plan',
        icon: LayoutTemplate,
        description: 'Structure for scoping and planning a new project.',
        content: `<h2>Project Title</h2>
<h3>Overview</h3>
<p>Brief description of the project goals and expected outcomes.</p>
<h3>Requirements</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="false">Req 1</li>
</ul>
<h3>Milestones</h3>
<ol>
  <li>Phase 1</li>
  <li>Phase 2</li>
</ol>`
    },
    {
        id: 'journal',
        name: 'Daily Journal',
        icon: Calendar,
        description: 'Template for daily reflection and tracking.',
        content: `<h2>Daily Reflection</h2>
<h3>What went well?</h3>
<p></p>
<h3>What could be improved?</h3>
<p></p>
<h3>Goals for tomorrow</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="false">Goal 1</li>
</ul>`
    },
    {
        id: 'tech-spec',
        name: 'Technical Spec',
        icon: Code,
        description: 'Outline for software architecture and design.',
        content: `<h2>Technical Specification</h2>
<h3>1. Introduction</h3>
<p>Context and problem statement.</p>
<h3>2. Proposed Solution</h3>
<p>High level architecture.</p>
<h3>3. API Design</h3>
<pre><code class="language-typescript">// API routes
</code></pre>
<h3>4. Database Schema</h3>
<p></p>`
    }
]

export function TemplatesGallery({ onSelect, onClose }: { onSelect: (html: string) => void, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="bg-background border border-border/50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5" />
                        Note Templates
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
                    {TEMPLATES.map(t => {
                        const Icon = t.icon
                        return (
                            <button key={t.id} onClick={() => { onSelect(t.content); onClose(); }}
                                className="flex flex-col items-start p-4 border border-border/40 rounded-xl hover:bg-muted/30 hover:border-primary/50 transition-all text-left">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-medium text-foreground mb-1">{t.name}</h3>
                                <p className="text-xs text-muted-foreground">{t.description}</p>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
