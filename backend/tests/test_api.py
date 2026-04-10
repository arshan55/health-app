from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_ai_recognize_missing_file():
    # Edge Case: Hit the recognize endpoint without a file
    response = client.post("/api/v1/ai/recognize")
    # FastAPI should automatically reject this with a 422 Unprocessable Entity
    assert response.status_code == 422
    assert "detail" in response.json()
