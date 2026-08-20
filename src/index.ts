import { qualifyLead } from "./modules/lead-qualification.js";

const demoLead = {
  name: "Demo Founder",
  company: "Example Studio",
  email: "founder@example.com",
  budget: 75_000,
  timelineDays: 21,
  message: "We need a proposal to build an AI automation workflow for incoming sales enquiries.",
};

const result = qualifyLead(demoLead);

console.log("AI Business Automation Starter");
console.log(JSON.stringify({ lead: demoLead, qualification: result }, null, 2));
