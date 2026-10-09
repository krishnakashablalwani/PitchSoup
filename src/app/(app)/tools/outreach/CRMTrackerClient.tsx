"use client";

import { useState } from "react";
import { Plus, MoreVertical, Mail, Calendar, CheckCircle2, XCircle, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PipelineStage = "To Contact" | "Contacted" | "Meeting Set" | "Due Diligence" | "Pass" | "Term Sheet";

interface InvestorContact {
  id: string;
  name: string;
  firm: string;
  email: string;
  stage: PipelineStage;
  lastContact: string;
  notes: string;
  amount: string;
}

const mockContacts: InvestorContact[] = [
  { id: "1", name: "Sarah Chen", firm: "Sequoia Capital", email: "sarah@sequoia.test", stage: "Contacted", lastContact: "2 days ago", notes: "Interested in our GTM strategy.", amount: "$2M" },
  { id: "2", name: "Marcus Johnson", firm: "Andreessen Horowitz", email: "marcus@a16z.test", stage: "Meeting Set", lastContact: "1 day ago", notes: "Meeting next Tuesday at 10 AM.", amount: "$5M" },
  { id: "3", name: "Elena Rodriguez", firm: "Lightspeed", email: "elena@lightspeed.test", stage: "To Contact", lastContact: "N/A", notes: "Need warm intro from David.", amount: "TBD" },
  { id: "4", name: "David Kim", firm: "Founders Fund", email: "david@ff.test", stage: "Due Diligence", lastContact: "3 hours ago", notes: "Sent data room access.", amount: "$3M" },
  { id: "5", name: "Amanda Smith", firm: "Greylock", email: "amanda@greylock.test", stage: "Pass", lastContact: "1 week ago", notes: "Too early for them. Keep in touch for Series A.", amount: "N/A" }
];

const stages: PipelineStage[] = ["To Contact", "Contacted", "Meeting Set", "Due Diligence", "Term Sheet", "Pass"];

export default function CRMTrackerClient() {
  const [contacts, setContacts] = useState<InvestorContact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStage, setActiveStage] = useState<PipelineStage | "All">("All");

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          contact.firm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = activeStage === "All" || contact.stage === activeStage;
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: PipelineStage) => {
    switch(stage) {
      case "To Contact": return "bg-mist-gray text-text-primary";
      case "Contacted": return "bg-blush-peach text-sienna-brown";
      case "Meeting Set": return "bg-sienna-brown/20 text-sienna-brown";
      case "Due Diligence": return "bg-ink-black text-paper-white";
      case "Term Sheet": return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "Pass": return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
      default: return "bg-mist-gray text-text-primary";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search investors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-subtle rounded-inputs text-[14px] focus:outline-none focus:border-sienna-brown focus:ring-1 focus:ring-sienna-brown transition-all"
            />
          </div>
          <button className="p-2 bg-bg-secondary border border-border-subtle rounded-inputs hover:bg-bg-card transition-colors shrink-0">
            <Filter className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-ink-black text-paper-white rounded-buttons text-[14px] font-medium hover:scale-105 transition-transform active:scale-95 shrink-0">
          <Plus className="w-4 h-4" />
          Add Investor
        </button>
      </div>

      {/* Stage Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => setActiveStage("All")}
          className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeStage === "All" ? "bg-bg-floating border-border-subtle shadow-sm text-text-primary" : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-transparent"}`}
        >
          All
        </button>
        {stages.map(stage => (
          <button
            key={stage}
            onClick={() => setActiveStage(stage)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeStage === stage ? "bg-bg-floating border border-border-subtle shadow-sm text-text-primary" : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-transparent"}`}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* CRM List View */}
      <div className="bg-bg-card border border-border-subtle rounded-cards overflow-hidden shadow-subtle-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-secondary/50">
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Investor</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Stage</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Last Contact</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary hidden md:table-cell">Notes</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact, i) => (
                    <motion.tr 
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="border-b border-border-subtle hover:bg-bg-secondary/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[15px] font-medium text-text-primary">{contact.name}</span>
                          <span className="text-[13px] text-text-tertiary">{contact.firm}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium ${getStageColor(contact.stage)}`}>
                          {contact.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-text-secondary">{contact.lastContact}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-[13px] text-text-secondary line-clamp-1 max-w-[200px] xl:max-w-[300px]">
                          {contact.notes}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-text-tertiary hover:text-text-primary bg-bg-secondary rounded-md transition-colors" title="Send Email">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-text-tertiary hover:text-text-primary bg-bg-secondary rounded-md transition-colors" title="Schedule">
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-text-tertiary hover:text-text-primary bg-bg-secondary rounded-md transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-tertiary text-[14px]">
                      No investors found in this stage.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
