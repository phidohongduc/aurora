# Aurora Backend API

FastAPI backend for Aurora job requisition system with AI-powered form filling.

## Features

- **AI-Powered Job Requisition**: `/fill-job-requisition` endpoint uses ChatGPT to automatically generate job requisition data from natural language prompts
- **Confidential Mode**: Support for marking requisitions as confidential

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Make sure your `.env` file contains:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the server**:
   ```bash
   python main.py
   ```
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### POST `/fill-job-requisition`

Generate job requisition data using AI based on a natural language prompt.

**Request Body**:
```json
{
  "prompt": "We need a Senior Backend Engineer for our engineering team, experienced with Python and FastAPI, 5-10 years experience, remote position, salary around $120k-$180k",
  "markConfidential": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "title": "Senior Backend Engineer",
    "department": "Engineering",
    "location": "Remote",
    "employmentType": "Full-time",
    "hiringManager": "Engineering Manager",
    "targetYearsMin": 5,
    "targetYearsMax": 10,
    "requiredSkills": ["Python", "FastAPI", "RESTful APIs", "Database Design"],
    "niceToHaveSkills": ["Docker", "Kubernetes", "AWS"],
    "salaryMin": 120000,
    "salaryMax": 180000
  },
  "message": "Job requisition data generated successfully"
}
```

**Example using curl**:
```bash
curl -X POST "http://localhost:8000/fill-job-requisition" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Senior Frontend Developer, React expert, 3-7 years, hybrid in San Francisco, $100k-$150k",
    "markConfidential": true
  }'
```

**Example using Python**:
```python
import requests

response = requests.post(
    "http://localhost:8000/fill-job-requisition",
    json={
        "prompt": "Junior Data Scientist, machine learning background, 1-3 years, onsite in Boston",
        "markConfidential": True
    }
)
print(response.json())
```

## Job Requisition Fields

The AI generates the following fields:

- **title**: Job title
- **department**: Department name
- **location**: "Remote" | "Hybrid" | "Onsite"
- **employmentType**: "Full-time" | "Part-time" | "Contract"
- **hiringManager**: Hiring manager name
- **targetYearsMin**: Minimum years of experience (optional)
- **targetYearsMax**: Maximum years of experience (optional)
- **requiredSkills**: Array of required skills
- **niceToHaveSkills**: Array of nice-to-have skills
- **salaryMin**: Minimum salary (optional)
- **salaryMax**: Maximum salary (optional)

## Development

The API includes CORS middleware configured to allow all origins for development. Update this in production.

## Tech Stack

- **FastAPI**: Modern Python web framework
- **OpenAI GPT-4**: AI model for generating job requisition data
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server
