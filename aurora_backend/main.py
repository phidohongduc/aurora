from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Literal
import os
from dotenv import load_dotenv
from openai import OpenAI
import json

# Load environment variables
load_dotenv()

app = FastAPI(title="Aurora Backend API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Type definitions
LocationType = Literal["Remote", "Hybrid", "Onsite"]
EmploymentType = Literal["Full-time", "Part-time", "Contract"]


# Request/Response Models
class FillJobRequisitionRequest(BaseModel):
    prompt: str
    markConfidential: bool = True


class JobRequisitionData(BaseModel):
    title: str
    department: str
    location: LocationType
    employmentType: EmploymentType
    hiringManager: str
    targetYearsMin: Optional[int] = None
    targetYearsMax: Optional[int] = None
    requiredSkills: List[str] = []
    niceToHaveSkills: List[str] = []
    salaryMin: Optional[int] = None
    salaryMax: Optional[int] = None


class FillJobRequisitionResponse(BaseModel):
    success: bool
    data: Optional[JobRequisitionData] = None
    message: Optional[str] = None


@app.get("/")
async def root():
    return {"message": "Aurora Backend API is running"}


@app.post("/fill-job-requisition", response_model=FillJobRequisitionResponse)
async def fill_job_requisition(request: FillJobRequisitionRequest):
    """
    Use ChatGPT to generate job requisition data based on a natural language prompt.
    """
    try:
        # Build the system prompt based on confidentiality status
        if request.markConfidential:
            system_prompt = """You are an AI assistant helping to fill out job requisition forms. 
This is CONFIDENTIAL information. Generate structured job requisition data based on the user's description.

Return ONLY a valid JSON object with the following structure:
{
  "title": "Job title",
  "department": "Department name",
  "location": "Remote" | "Hybrid" | "Onsite",
  "employmentType": "Full-time" | "Part-time" | "Contract",
  "hiringManager": "Manager name",
  "targetYearsMin": number or null,
  "targetYearsMax": number or null,
  "requiredSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1", "skill2"],
  "salaryMin": number or null,
  "salaryMax": number or null
}

Important:
- All fields must be present
- Use realistic and professional values
- Infer reasonable values based on the job description
- Return ONLY the JSON, no additional text or explanation"""
        else:
            system_prompt = """You are an AI assistant helping to fill out job requisition forms. 
Generate structured job requisition data based on the user's description.

Return ONLY a valid JSON object with the following structure:
{
  "title": "Job title",
  "department": "Department name",
  "location": "Remote" | "Hybrid" | "Onsite",
  "employmentType": "Full-time" | "Part-time" | "Contract",
  "hiringManager": "Manager name",
  "targetYearsMin": number or null,
  "targetYearsMax": number or null,
  "requiredSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1", "skill2"],
  "salaryMin": number or null,
  "salaryMax": number or null
}

Important:
- All fields must be present
- Use realistic and professional values
- Infer reasonable values based on the job description
- Return ONLY the JSON, no additional text or explanation"""

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        # Parse the response
        content = response.choices[0].message.content
        job_data = json.loads(content)

        # Validate and create the response
        requisition_data = JobRequisitionData(**job_data)

        return FillJobRequisitionResponse(
            success=True,
            data=requisition_data,
            message="Job requisition data generated successfully"
        )

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse AI response: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
