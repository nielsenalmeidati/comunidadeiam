"use client";
import { useState } from "react";
import { FileText, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type Note = { id: string; title: string; content: string; date: string };

const initialNotes: Note[] = [
  { id: "1", title: "Anotações — Bootcamp Mental", content: "- Síndrome do impostor: sentimento de não ser merecedor do sucesso\n- Blindagem contra o medo: agir apesar do medo, não esperar ele passar\n- Mentalidade empreendedora: foco em soluções, não em problemas", date: "01/04/2026" },
];

export default function AnotacoesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [active, setActive] = useState<Note | null>(notes[0]);
  const [editing, setEditing] = useState(false);

  const addNote = () => {
    const n: Note = { id: Date.now().toString(), title: "Nova anotação", content: "", date: new Date().toLocaleDateString("pt-BR") };
    setNotes([n, ...notes]);
    setActive(n);
    setEditing(true);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    setActive(updated[0] ?? null);
  };

  const updateActive = (field: keyof Note, value: string) => {
    if (!active) return;
    const updated = { ...active, [field]: value };
    setActive(updated);
    setNotes(notes.map((n) => n.id === updated.id ? updated : n));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><h2 className="font-semibold text-sm">Anotações</h2></div>
          <Button size="icon" variant="ghost" className="w-7 h-7" onClick={addNote}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {notes.map((n) => (
            <button key={n.id} onClick={() => { setActive(n); setEditing(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${active?.id === n.id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground"}`}>
              <p className="text-xs font-medium truncate">{n.title}</p>
              <p className="text-xs opacity-60">{n.date}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {active ? (
          <>
            <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between shrink-0">
              {editing
                ? <input value={active.title} onChange={(e) => updateActive("title", e.target.value)} className="bg-transparent text-lg font-semibold focus:outline-none flex-1" />
                : <h1 className="text-lg font-semibold">{active.title}</h1>}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditing(!editing)} className="gap-2 text-xs">
                  <Save className="w-3 h-3" />{editing ? "Salvar" : "Editar"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteNote(active.id)} className="text-red-400 hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {editing
                ? <textarea value={active.content} onChange={(e) => updateActive("content", e.target.value)} className="w-full h-full bg-transparent text-sm text-foreground focus:outline-none resize-none leading-relaxed" placeholder="Escreva suas anotações aqui..." />
                : <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{active.content || <span className="text-muted-foreground">Sem conteúdo. Clique em Editar para começar.</span>}</pre>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center"><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="text-sm">Nenhuma anotação selecionada</p><Button className="mt-4 bg-primary hover:bg-primary/90" onClick={addNote}>+ Nova anotação</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
