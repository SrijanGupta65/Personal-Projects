# Salesforce x Lovable Hackathon: Metro City AI 311 Intake System

**[🚀 Try the Live Demo](https://id-preview--a545690b-399c-4a19-988a-7c2d428fd4fd.lovable.app/)**

## 🏆 Hackathon Project Overview

This project was built for the **Salesforce x Lovable Hackathon**, where we explored innovative applications of agentic AI to solve real-world problems. Our team identified a critical pain point in city government operations and developed an AI-powered solution using Lovable's low-code platform.

**Achievement:** Placed **Top 5** in the hackathon competition while competing against graduate students as undergraduate participants.

## 🎯 The Problem: Legacy 311 Systems Are Overloaded

Modern cities rely heavily on **311 non-emergency service lines** to handle everything from reporting potholes and graffiti to filing non-emergency police reports. However, the current system is broken:

### Current State of 311 Services:
- **27+ minute average wait times** for non-emergency calls in major cities like New York (NYC Government)
- **Thousands of calls go unanswered every month** due to capacity constraints (New York Post)
- Each call requires **20-30 minutes of manual intake** by human dispatchers
- Manual categorization and routing leads to high error rates and delays
- Citizens experience frustration and longer response times for their issues

### Why This Matters:
Cities process **millions of 311 requests per year**. The inefficiency of current intake systems directly impacts public service delivery, citizen satisfaction, and municipal resource allocation. The bottleneck isn't just a convenience issue—it's a critical infrastructure problem that affects emergency response prioritization and public safety.

## 💡 The Solution: AI-Powered Multi-Agent Intake System

We built an **intelligent routing and intake automation system** using agentic AI that dramatically improves how cities process 311 requests. The system uses multiple specialized AI agents to classify, route, and handle citizen requests 24/7.

### Architecture Overview:

**Three Core Agents:**

1. **Router Agent**
   - Understands citizen requests using natural language
   - Classifies request type (police report, infrastructure, etc.)
   - Detects emergency situations and escalates to 911
   - Routes to the appropriate specialized agent

2. **Public Safety Agent**
   - Handles non-emergency police reports
   - Collects detailed incident information
   - Creates official incident reports
   - Assigns to appropriate police precinct queue

3. **Public Works Agent**
   - Manages infrastructure requests (potholes, graffiti, etc.)
   - Collects location and severity details
   - Creates work orders for maintenance crews
   - Routes to Public Works department queue

### Citizen Journey:

```
Step 1: Citizen Contact
    ↓
    (Call 311 or use web portal)
    ↓
Step 2: Router Agent
    ↓
    (AI understands request using natural language)
    ↓
Step 3: Agent Routing
    ↓
    (Router identifies issue type and routes to appropriate agent)
    ↓
Step 4: Backend Automation
    ↓
    (Collects details, creates tickets, assigns to queue)
    ↓
Step 5: Outcome
    ↓
    (Citizen receives confirmation and tracking number)
```

## 📊 Business Impact

### Operational Efficiency
- **75% faster report intake** — AI processes requests in seconds, not minutes
- **6x throughput** — AI handles 6 reports in the time a human dispatcher handles 1
- Dispatchers freed up for complex cases requiring human judgment

### Cost Savings
- Reduced dispatcher workload and overtime staffing needs
- **~95% routing accuracy** eliminates costly error corrections
- Improved resource allocation across city departments

### Citizen Experience
- **24/7 availability** — No more busy signals or wait lists
- Faster response times for legitimate service requests
- Higher reporting participation when citizens can submit instantly
- Real-time tracking numbers and confirmation

## 🚀 Live Demo

**Try the AI 311 Intake System:** https://id-preview--a545690b-399c-4a19-988a-7c2d428fd4fd.lovable.app/

### Features Demonstrated:
- Voice intake simulation (citizen calls 311)
- Real-time natural language understanding
- Intelligent request routing
- Department-specific intake workflows
- Service ticket generation and tracking

## 🛡️ Safety & Guardrails

The system includes critical safeguards:
- **Emergency detection** — Life-threatening situations are immediately escalated to 911
- **Human dispatcher oversight** — Complex or low-confidence requests are flagged for human review
- **Confidence-based routing** — Only high-confidence classifications are automated
- **Audit trails** — All AI decisions are logged for transparency

## 🔧 Technology Stack

- **Platform:** Lovable (Agentic AI Demo Builder)
- **AI Framework:** Salesforce Agentforce
- **Architecture:** Multi-agent system with specialized roles
- **Integration:** City service categories and department routing rules

## 📈 Real-World Impact Potential

This solution directly addresses the operational challenges cities face:
- ✅ Millions of 311 requests annually can be processed efficiently
- ✅ Reduces burden on emergency services by properly triaging calls
- ✅ Improves citizen trust in government responsiveness
- ✅ Scalable across cities of any size
- ✅ Reduces costs while improving service delivery

---

**Built at:** Salesforce x Lovable Hackathon  
**Focus:** Agentic AI for Government Innovation
