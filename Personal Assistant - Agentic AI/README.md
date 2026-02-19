# Srijan's Personal Assistant - Agentic AI

An intelligent personal assistant powered by agentic AI that automates routine tasks by understanding natural language commands and executing them autonomously.

## Overview

This project is built on the concept of **Agentic AI** — AI agents that can perceive their environment, make decisions, and take actions toward specific goals without explicit step-by-step instructions. The assistant acts as a personal agent that interprets user intents and executes complex workflows automatically.

**Currently, the assistant handles job search optimization and calendar management.** I'm actively expanding its capabilities by identifying and integrating new use cases, allowing it to become a more comprehensive personal productivity tool over time.

## Current Capabilities

### 🎯 Job Search & Recommendation Agent
- **LinkedIn Job Scraping**: Automatically scrapes job listings from LinkedIn
- **Smart Filtering**: Filters jobs based on your resume and qualifications
- **Fit Scoring**: Analyzes each job listing and scores how well it matches your profile
- **Recommendations**: Generates a prioritized list of the best job matches for you to apply to

### 📅 Calendar Management Agent
- **Event Creation**: Extracts dates, times, and event details from natural language
- **Calendar Integration**: Automatically creates calendar invites and events
- **Information Extraction**: Intelligently parses text to identify event metadata

## How It Works

The system operates on an **intent-based architecture**:

1. **Natural Language Understanding**: User input is processed by Claude (via AWS Bedrock) to understand the user's intent and extract relevant information
   - Converts natural language into structured decisions
   - Identifies the required action (e.g., job search, calendar event creation)
   - Extracts contextual details needed for automation

2. **Agent Execution**: Based on the identified intent, the appropriate automated workflow is triggered via n8n
   - Agents autonomously process data and execute actions
   - Interact with external services (LinkedIn, Google Calendar, Google Sheets, etc.)
   - Handle complex multi-step tasks with minimal intervention

3. **Result Delivery**: Processed results are returned to the user in a structured, actionable format

## Architecture

The system uses a simple yet powerful pipeline:

```
User Input → AWS Bedrock (Claude) → Structured Output → Switch Router → Agent Workflows → Result
```

- **Frontend**: Simple web interface for voice/text input
- **Webhook**: Receives natural language requests
- **AWS Bedrock Chat Model**: Processes user input and determines the appropriate action
- **Structured Output Parser**: Converts Claude's response into a defined schema with intent
- **Switch Node**: Routes to the appropriate agent workflow based on detected intent
- **Agent Workflows**: Parallel execution paths for job search and calendar management
- **External Integrations**: LinkedIn, Google Sheets, Google Calendar

## Tech Stack

- **n8n**: Workflow automation and agent orchestration
- **AWS Bedrock**: LLM inference and natural language processing
- **Claude (Anthropic)**: Natural language understanding and agentic decision-making
- **HTML/JavaScript**: Web interface
- **Google APIs**: Calendar and Sheets integration

## Next Steps

- [ ] Expand use cases beyond job search and calendar management
- [ ] Add email automation agent
- [ ] Implement meeting scheduling agent
- [ ] Build note-taking and knowledge management agent
- [ ] Add voice interface for hands-free operation
- [ ] Improve intent classification accuracy
- [ ] Add multi-step reasoning for complex tasks

## Future Vision

This project aims to become a comprehensive personal agent that can handle a wide variety of routine tasks, from professional development (job hunting, career tracking) to personal organization (calendar, notes, reminders). The goal is to create an AI system that truly understands context and can autonomously complete complex workflows with minimal user input.

---

**Status**: Early development - Core job search and calendar features functional. Actively expanding use cases.
