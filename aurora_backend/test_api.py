#!/usr/bin/env python3
"""Test script for the fill-job-requisition endpoint"""

import requests
import json

def test_fill_job_requisition():
    url = "http://localhost:8000/fill-job-requisition"
    
    # Test data
    payload = {
        "prompt": "We need a Senior Backend Engineer for our engineering team, experienced with Python and FastAPI, 5-10 years experience, remote position, salary around $120k-$180k",
        "markConfidential": True
    }
    
    print("Testing /fill-job-requisition endpoint...")
    print(f"Request: {json.dumps(payload, indent=2)}")
    print("\nSending request...")
    
    try:
        response = requests.post(url, json=payload)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ Test passed!")
        else:
            print("\n❌ Test failed!")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to server. Make sure the server is running on port 8000.")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

if __name__ == "__main__":
    test_fill_job_requisition()
